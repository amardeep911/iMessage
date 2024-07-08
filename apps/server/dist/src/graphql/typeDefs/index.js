"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_1 = __importDefault(require("./conversation"));
const messages_1 = __importDefault(require("./messages"));
const user_1 = __importDefault(require("./user"));
const typeDefs = [conversation_1.default, user_1.default, messages_1.default];
exports.default = typeDefs;
