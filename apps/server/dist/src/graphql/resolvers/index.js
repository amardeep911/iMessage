"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const conversation_1 = __importDefault(require("./conversation"));
const message_1 = __importDefault(require("./message"));
const scalars_1 = __importDefault(require("./scalars"));
const user_1 = __importDefault(require("./user"));
const resolvers = (0, lodash_merge_1.default)({}, user_1.default, conversation_1.default, message_1.default, scalars_1.default);
exports.default = resolvers;
