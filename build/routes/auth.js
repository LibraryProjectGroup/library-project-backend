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
const express_1 = require("express");
const user_1 = require("../queries/user");
const session_1 = require("../queries/session");
const crypto_1 = __importDefault(require("crypto"));
const timeout = 60 * 60 * 24 * 7; // 7 days before user has to login again
const minUsernameLength = 3;
const maxUsernameLength = 50;
const minPasswordLength = 3;
const maxPasswordLength = 150;
const router = (0, express_1.Router)();
function createSession(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Secret should be unique but duplicates shouldn't really cause any issues
        let secret = crypto_1.default.randomBytes(16).toString('hex');
        return yield (0, session_1.queryInsertSession)(userId, secret, timeout);
    });
}
router.get('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    const password = req.query.password;
    if (username == undefined ||
        username.length < minUsernameLength ||
        username.length > maxUsernameLength)
        return res.status(400).json({
            ok: false,
            message: 'Username has to be between 3 and 50 characters',
        });
    if (password == undefined ||
        password.length < minPasswordLength ||
        password.length > maxPasswordLength)
        return res.status(400).json({
            ok: false,
            message: 'Password has to be between 3 and 50 characters',
        });
    let user = yield (0, user_1.querySelectUserByName)(username);
    if (user != null)
        return res.status(400).json({
            ok: false,
            message: 'Username is already taken',
        });
    let newUser = yield (0, user_1.queryInsertUser)(username, password, false);
    if (newUser == null)
        return res.status(500).json({ ok: false });
    let session = yield createSession(newUser.id);
    if (session == null)
        return res.status(500).json({ ok: false });
    res.json({
        ok: true,
        secret: session.secret,
    });
}));
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    const password = req.query.password;
    let user = yield (0, user_1.querySelectUserByName)(username);
    if (user == null)
        return res.status(404).json({
            ok: false,
            message: 'No account by that username',
        });
    if (user.passw != password)
        return res.status(403).json({
            ok: false,
            message: 'Invalid password',
        });
    let session = yield createSession(user.id);
    if (session == null)
        return res.status(500).json({ ok: false });
    res.json({
        ok: true,
        secret: session.secret,
    });
}));
router.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies || !req.cookies.librarySession)
        return res.status(400).json({ ok: false, message: 'No session' });
    if (yield (0, session_1.queryInvalidateSession)(req.cookies.librarySession)) {
        res.json({ ok: true });
    }
    else {
        res.status(404).json({ ok: false, message: 'Unknown session' });
    }
}));
exports.default = router;
