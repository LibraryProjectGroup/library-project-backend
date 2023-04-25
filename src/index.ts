import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";
import expressBearerToken from "express-bearer-token";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import bookRouter from "./routes/book";
import userRouter from "./routes/user";
import officeRouter from "./routes/office";
import borrowRouter from "./routes/borrow";
import book_listRouter from "./routes/book_list";
import book_list_entryRouter from "./routes/book_list_entry";
import book_requestRouter from "./routes/book_request";
import book_reservationRouter from "./routes/book_reservation";
import Session from "./interfaces/session.interface";
import passwordreset, {
  publicRouter as publicPasswordReset,
} from "./routes/password_reset";
import { querySelectSessionBySecret } from "./queries/session";
import User from "./interfaces/user.interface";
import { querySelectUserBySessionId } from "./queries/user";
import { migrate } from "./sql_migrate";
import { Sequelize } from "sequelize";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_SERVER: string;
      DATABASE_NAME: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      PORT: string;
    }
  }

  namespace Express {
    interface Request {
      session: Session;
      sessionUser: User;
    }
  }
}

const app: Express = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(expressBearerToken());

app.use("/health", healthRouter);

app.use("/auth", authRouter);
app.use("/passwordreset", publicPasswordReset);
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) return res.sendStatus(401);
  try {
    let session = await querySelectSessionBySecret(req.token);
    if (session == null) return res.sendStatus(401);
    req.session = session;
    let user = await querySelectUserBySessionId(session.id);
    if (user == null) return res.sendStatus(401);
    req.sessionUser = user;

    next();
    return;
  } catch (err) {
    console.error(err);
  }
  res.sendStatus(500);
});
app.use("/book", bookRouter);
app.use("/office", officeRouter);
app.use("/user", userRouter);
app.use("/borrow", borrowRouter);
app.use("/booklist", book_listRouter);
app.use("/booklistentry", book_list_entryRouter);
app.use("/bookrequest", book_requestRouter);
app.use("/bookreservation", book_reservationRouter);
app.use("/passwordreset", passwordreset);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({
    ok: false,
  });
});

const pool = mysql.createPool({
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

(async () => {
  const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DATABASE_SERVER,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  await migrate(sequelize);
})();

export { app, pool };
