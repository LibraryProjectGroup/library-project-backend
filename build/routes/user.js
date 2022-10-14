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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../queries/user");
const router = (0, express_1.Router)();
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, user_1.querySelectAllUsers)());
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    res.json(yield (0, user_1.querySelectUser)(userId));
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    res.json({ ok: yield (0, user_1.queryDeleteUser)(userId) });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    const password = req.query.password;
    const administrator = parseInt(req.query.administrator);
    res.json({ ok: yield (0, user_1.queryInsertUser)(username, password, administrator) });
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        id: parseInt(req.query.id),
        username: req.query.username,
        passw: req.query.password,
        administrator: parseInt(req.query.administrator),
    };
    res.json({ ok: yield (0, user_1.queryUpdateUser)(user) });
}));
exports.default = router;
