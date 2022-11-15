import { test, describe, jest, afterAll } from "@jest/globals";
import request from "supertest";
import { app, pool } from "../../src";

jest.mock("../../src/queries/session");
jest.mock("../../src/queries/book");

describe("basic endpoint testing for /book", () => {
    test("get /book/all", async () => {
        return request(app)
            .get("/book/all")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("get /book", async () => {
        return request(app)
            .get("/book?id=1")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("delete /book", async () => {
        return request(app)
            .delete("/book?id=1")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("post /book", async () => {
        return request(app)
            .post("/book")
            .send({
                title: "title",
                author: "author",
                isbn: "isbn",
                topic: "topic",
                location: "location",
            })
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect({ ok: true });
    });

    test("put /book", async () => {
        return request(app)
            .put("/book")
            .send({
                id: 3,
                title: "editedtitle",
                author: "editedauthor",
                isbn: "editedisbn",
                topic: "editedtopic",
                location: "editedlocation",
            })
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect({ ok: true });
    });
});

afterAll((done) => {
    pool.end();
    done();
});
