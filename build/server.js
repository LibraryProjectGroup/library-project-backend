"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
index_1.app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
