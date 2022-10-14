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
const book_1 = require("../queries/book");
const router = (0, express_1.Router)();
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield (0, book_1.querySelectAllBooks)());
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.query.id;
    res.json(yield (0, book_1.querySelectBook)(bookId));
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.query.id;
    res.json({ ok: yield (0, book_1.queryDeleteBook)(bookId) });
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = {
        library_user: 1,
        title: req.query.title,
        author: req.query.author,
        topic: req.query.topic,
        isbn: req.query.isbn,
        location: req.query.location,
    };
    res.json({ ok: yield (0, book_1.queryInsertBook)(book) });
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = {
        // Iffy parseInt here. TODO
        id: parseInt(req.query.id),
        library_user: 1,
        title: req.query.title,
        author: req.query.author,
        topic: req.query.topic,
        isbn: req.query.isbn,
        location: req.query.location,
    };
    res.json({ ok: yield (0, book_1.queryUpdateBook)(book) });
}));
exports.default = router;
