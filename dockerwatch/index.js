/*
    Author: Axel Riska (ImWuX)
    IMPORTANT: This is barely tested and will probably break in most instances.
        It was specifically made for https://github.com/LibraryProjectGroup/library-project-backend
*/
import Docker from "dockerode";
import fetch from "node-fetch";
import fs from "fs/promises";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function updateAllContainers() {
    const containers = await docker.listContainers();
    for(let container of containers) {
        updateContainer(container.Id);
    }
}

async function updateContainer(containerId) {
    const container = docker.getContainer(containerId);
    const containerInfo = await container.inspect();
    const image = docker.getImage(containerInfo.Image);
    const imageInfo = await image.inspect();

    const repoTag = containerInfo.Config.Image;
    const namespace = repoTag.split("/")[0];
    const repository = repoTag.split("/")[1].split(":")[0];
    const tag = repoTag.split("/")[1].split(":")[1];

    const res = await fetch(`https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}/tags/${tag}`);
    const data = await res.json();

    const log = async (str) => {
        const date = new Date();
        console.log(`[\x1b[36m${date.toLocaleString()}\x1b[0m] \x1b[35m${repoTag} |\x1b[0m ${str}`)
        await fs.appendFile(`./log_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.txt`, `[${date.toLocaleString()}] ${repoTag} | ${str}\n`);
    };

    if(data.images[0].digest != imageInfo.RepoDigests[0].split("@")[1]) {
        await log("Outdated, proceeding to update");
        docker.pull(repoTag, (err, stream) => {
            let status = {};
            docker.modem.followProgress(stream, async () => {
                if(process.stdout.moveCursor == "function")
                    process.stdout.moveCursor(0, Object.values(status).length);
                await log("New version pulled");
                await container.kill();
                await log(`Container ${containerInfo.Name} killed`);
                await container.remove();
                await log(`Container ${containerInfo.Name} removed`);
                await image.remove();
                await log("Old image removed");

                let config = containerInfo.Config;
                config.HostConfig = {
                    RestartPolicy: containerInfo.HostConfig.RestartPolicy,
                    PortBindings: containerInfo.HostConfig.PortBindings
                }

                const newContainer = await docker.createContainer(config);
                const newContainerInfo = await newContainer.inspect();
                await log(`Container ${newContainerInfo.Name} created`);

                await newContainer.start();
                await log(`Container ${newContainerInfo.Name} started`);
            }, async (event) => {
                status[event.id] = { status: event.status, progress: event.progress };
                if(typeof(process.stdout.clearScreenDown) == "function" && process.stdout.moveCursor == "function") {
                    process.stdout.clearScreenDown();
                    Object.values(status).forEach((s) => {
                        console.log(`[\x1b[36m${new Date().toLocaleString()}\x1b[0m] \x1b[35m${repoTag} |\x1b[0m ${s.status} ${s.progress ? s.progress : ""}`)
                    });
                    process.stdout.moveCursor(0, -Object.values(status).length);
                }
            });
        });
    } else {
        await log("Up to date");
    }
}

updateAllContainers();