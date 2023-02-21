"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = __importDefault(require("./allowedOrigins"));
const corsOptions = {
    // @ts-ignore - to ignore typescript warnings
    origin: (origin, callback) => {
        if (allowedOrigins_1.default.indexOf(origin) !== -1 || !origin) {
            callback(null, true); //send true when origin url in the whitelist
        }
        else {
            callback(new Error('not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};
exports.default = corsOptions;
