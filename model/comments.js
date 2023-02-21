"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.commentSchema = new Schema();
exports.commentSchema.add({
    userId: String,
    image: String,
    nickname: String,
    date: String,
    message: String,
    score: Number,
    tagUser: {
        isTrue: {
            type: Boolean,
            default: false,
        },
        userId: String,
        userName: String,
    },
    commentIndent: {
        level: {
            type: Number,
            default: 0,
        },
        commentIds: [String],
    },
    responses: [exports.commentSchema],
}); // adding schema to schema make it recursive
const CommentsModel = mongoose_1.default.model('comments', exports.commentSchema);
exports.default = CommentsModel;
