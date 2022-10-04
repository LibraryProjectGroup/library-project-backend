import { Express, Response, Request } from "express";
import { Pool } from "mysql2";
import { querySelectAllUsers, querySelectUser, queryDeleteUser, queryInsertUser } from "../queries/userQueries";
import User from "../interfaces/user.interface";

const routeBook = (app: Express, pool: Pool) => {
  const route = "/book";

  app.get("/allusers", async (req: Request, res: Response) => {
    const usersResult = await querySelectAllUsers(pool);
    res.json(usersResult);
  });

  app.get("/user", async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const userResult = await querySelectUser(pool, userId);
    res.json(userResult);
  });

  app.delete("/user", async (req: Request, res: Response) => {
    const userId = req.query.id as string;
    const deleteResult = await queryDeleteUser(pool, userId);
    res.json({ ok: deleteResult });
  });

  app.post("/user", async (req: Request, res: Response) => {
    const user: User = {
      username: req.query.username as string,
      password: req.query.password as string,
      // TODO: boolean from req
      administrator: true,
    };
    const insertResult = await queryInsertUser(pool, user);
    res.json({ ok: insertResult });
  });
};

export default routeBook;
