import { Response, Request, Router, NextFunction } from "express";
import {
  querySelectAllUsers,
  querySelectUser,
  querySoftDeleteUser,
  queryInsertUser,
  queryUpdateUser,
  queryAdminUpdateUser,
} from "../queries/user";
import User from "../interfaces/user.interface";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await querySelectAllUsers();
    const formattedUsers = [];
    for (const user of users) {
      formattedUsers.push({
        id: user.id,
        username: user.username,
        email: user.email,
        administrator: user.administrator,
        homeOfficeId: user.homeOfficeId,
      });
    }
    res.json(formattedUsers);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await querySelectUser(Number(req.query.id));
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        administrator: user.administrator,
      });
    } else {
      res.status(404).json({ ok: false });
    }
  } catch (err) {
    next(err);
  }
});

router.get(
  "/session",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: req.sessionUser.id,
      username: req.sessionUser.username,
      email: req.sessionUser.email,
      administrator: req.sessionUser.administrator,
      deleted: req.sessionUser.deleted,
    });
  }
);

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser.administrator) {
      res.json({ ok: await querySoftDeleteUser(Number(req.body.id)) });
    } else {
      res.status(403).json({ ok: false });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser.administrator) {
      const username = req.query.username as string;
      const email = req.query.email as string;
      const password = req.query.password as string;
      const administrator = Boolean(Number(req.query.administrator));
      const deleted = false;
      res.json({
        ok: await queryInsertUser(
          username,
          email,
          password,
          administrator,
          deleted
        ),
      });
    } else {
      res.status(403).json({ ok: false });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser.administrator) {
      const user: User = {
        id: Number(req.query.id),
        username: req.query.username as string,
        email: req.query.email as string,
        passw: req.query.password as string,
        administrator: req.query.administrator === "true" ? true : false,
        deleted: false,
        homeOfficeId: parseInt(req.query.homeOfficeId as string),
      };
      res.json({ ok: await queryUpdateUser(user) });
    } else {
      res.status(403).json({ ok: false });
    }
  } catch (err) {
    next(err);
  }
});

router.put(
  "/admin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.sessionUser.administrator) {
        // Another new interface for this?
        const user: User = {
          id: Number(req.query.id),
          username: req.query.username as string,
          email: req.query.email as string,
          passw: "null",
          administrator: req.query.administrator === "true" ? true : false,
          deleted: false,
          homeOfficeId: parseInt(req.query.homeOfficeId as string),
        };
        res.json({ ok: await queryAdminUpdateUser(user) });
      } else {
        res.status(403).json({ ok: false });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
