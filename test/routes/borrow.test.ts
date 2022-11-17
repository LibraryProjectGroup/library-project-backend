import { test, describe, jest, afterAll } from "@jest/globals";
import request from "supertest";
import { app, pool } from "../../src";

jest.mock("../../src/queries/session");
jest.mock("../../src/queries/borrow");

describe("basic endpoint testing for /borrow", () => {
    test("get /borrow/all", async () => {
        return request(app)
            .get("/borrow/all")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("get /borrow", async () => {
        return request(app)
            .get("/borrow?id=1")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    // WRONG WRONG WRONG WRONG WRONG
    test("delete /borrow", async () => {
        return request(app)
            .delete("/borrow?id=2")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    //High chance of being wrong
    test("post /borrow", async () => {
        return request(app)
            .post("/borrow")
            .send()
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect({ ok: true });
    });

    test("put /borrow", async () => {
        return request(app)
            .put("/borrow")
            .send({
                id: 1,
                libary_user: 1,
                book: 1,
                borrowDate: new Date(),
                dueDate: new Date(),
                returned: false,
            })
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect({ ok: true });
    });

    test("get /borrow/current", async () => {
        return request(app)
            .get("/borrow/current")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    // mock querie queryDetailedExpiredBorrows() not done yet
    test("get /borrow/expired/admin", async () => {
        return request(app)
            .get("/borrow/expired/admin")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    // mock querie querySelectAllCurrentBorrows2() not done yet
    test("get /borrow/current/admin", async () => {
        return request(app)
            .get("/borrow/current/admin")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("get /borrow/expired", async () => {
        return request(app)
            .get("/borrow/expired")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    test("get /borrow/session", async () => {
        return request(app)
            .get("/borrow/session")
            .set("Authorization", `Bearer 123`)
            .expect(200)
            .expect("Content-Type", /json/);
    });

    // WRONG WRONG WRONG WRONG WRONG
    test("put /borrow/return", async () => {
        return request(app)
            .put("/borrow/return")
            .send({
                id: 1,
                libary_user: 1,
                book: 1,
                borrowDate: new Date(),
                dueDate: new Date(),
                returned: false,
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
