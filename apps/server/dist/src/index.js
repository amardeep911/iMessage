"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.json('hello there kuldeep');
});
app.get('/post', (req, res) => {
    res.json({ name: 'kuldeep ranjan ssr' });
});
app.listen(port, () => {
    console.log('server started');
});
//# sourceMappingURL=index.js.map