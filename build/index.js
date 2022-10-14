"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql2_1 = __importDefault(require("mysql2"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const book_1 = __importDefault(require("./routes/book"));
const user_1 = __importDefault(require("./routes/user"));
const example_1 = __importDefault(require("./routes/example"));
const session_1 = require("./queries/session");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use('/auth', auth_1.default);
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies || !req.cookies.librarySession)
        return res.sendStatus(401);
    try {
        let session = yield (0, session_1.querySelectSessionBySecret)(req.cookies.librarySession);
        if (session == null)
            return res.sendStatus(401);
        req.session = session;
        next();
        return;
    }
    catch (err) {
        console.error(err);
    }
    res.sendStatus(500);
}));
app.use('/book', book_1.default);
app.use('/user', user_1.default);
app.use('/example', example_1.default);
const pool = mysql2_1.default.createPool({
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});
exports.pool = pool;
