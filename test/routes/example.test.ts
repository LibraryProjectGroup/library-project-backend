import { test, describe, jest, afterAll } from "@jest/globals";
import request from "supertest";
import { app, pool } from "../../src";

jest.mock("../../src/queries/session");
jest.mock("../../src/queries/user");

describe("example test to make sure jest works", () => {
    test("get unauthorized from /", async () => {
        return request(app).get("/").expect(401);
    });
});

afterAll((done) => {
    pool.end();
    done();
});
