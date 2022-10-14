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
const router = (0, express_1.Router)();
const EXAMPLE_BOOK = {
    id: 1,
    library_user: 'John Doe',
    title: 'Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition',
    author: 'Klabnik, Steve',
    topic: 'Machine Learning',
    isbn: '9781492032649',
    location: 'Helsinki',
};
const EXAMPLE_BOOK_2 = Object.assign(Object.assign({}, EXAMPLE_BOOK), { id: 2, title: 'Book 2' });
const EXAMPLE_BOOK_3 = Object.assign(Object.assign({}, EXAMPLE_BOOK), { id: 3, title: 'Book 3' });
const EXAMPLE_BOOKS = [
    EXAMPLE_BOOK,
    EXAMPLE_BOOK_2,
    EXAMPLE_BOOK_3,
];
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(EXAMPLE_BOOKS);
}));
exports.default = router;
