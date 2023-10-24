backend-staging-efilibrary.xxx.com > 245.324.123.4
production-staging-efilibrary.xxx.com > 245.324.123.4

Please note how both URLs point to the same IP-address

Browser > Nginx > Staging OR production Server

MySQL (production)
MySQL (staging)

# GitHub Actions

When something is merged to main we deploy it to production (**Currently not implemented**)
When something is merged to development we deploy it to staging

Create docker images in GitHub Actions from the Dockerfile
Push the docker images to GitHub Container
Registry (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

On the server:
Install Docker

- https://docs.docker.com/engine/install/ubuntu/
- Follow guide until "Upgrade Docker Engine"

Create two storage locations and a network:
docker volume create staging-data
docker volume create production-data
docker network create efilibrary

Start MySQL servers
docker run --name staging-mysql --network=efilibrary -v staging-data:/var/lib/mysql --restart=always -e
MYSQL_ROOT_PASSWORD=3c35281b8a5104e58c84 -d mysql:8
docker run --name production-mysql --network=efilibrary -v production-data:/var/lib/mysql --restart=always -e
MYSQL_ROOT_PASSWORD=2bb747bce69185432410 -d mysql:8

# NGINX

Create a "nginx-gateway" directory somewhere accessible to everyone

Create a nginx.conf file in there:

```
events {}

http {
        server {
                listen 80;
                server_name frontend-staging-efilibrary.xxx.com;

                location / {
                        proxy_pass http://efilibrary-frontend-staging:3000/;
                }
        }

        server {
                listen 80;
                server_name backend-staging-efilibrary.xxx.com;

                location / {
                        proxy_pass http://efilibrary-backend-staging:3000/;
                }
        }

        server {
                listen 80 default_server;
                server_name  _;
                return 444;
        }
}
}
```

Run NGINX:
docker run --name eflibrary-nginx --network=efilibrary -v <somepath?>nginx-gateway/nginx.conf:/etc/nginx/nginx.conf:ro
-p 80:80 -d nginx

# Actions steps (backend AND frontend):

- Build Docker image and "tag" it with current Git commit
- Publish image to GitHub container
  registry (https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-github-packages)

- Connect to VPS using SSH
  - Remove old Docker container [ docker cotnainer rm eflibrary-(staging/production)-(frontend/backend) ]
  - Start new Docker
    contaienr [ docker container run eflibrary-(staging/production)-(frontend/backend) --restart=always -d <docker image location> ]
  - Restart NGINX [ docker container restart eflibrary-nginx ]

IMPORTANT **Please reference the GitHub actions**
