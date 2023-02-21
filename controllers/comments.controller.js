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
const format_1 = __importDefault(require("date-fns/format"));
const comments_1 = __importDefault(require("../model/comments"));
const comments_services_1 = __importDefault(require("../services/comments.services"));
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.originalUrl);
    const result = yield comments_1.default.find({}).exec();
    return res.status(200).json(result);
});
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.originalUrl);
    const { userId, image, nickname, message, tagUser, commentIndent } = req.body;
    let commentTree = {
        userId,
        image,
        nickname,
        date: (0, format_1.default)(new Date(), 'yyyy.MM.dd.HH.mm.ss'),
        message,
        score: 0,
        tagUser,
        commentIndent,
        responses: [],
    };
    const result = yield comments_services_1.default.saveComment(commentTree);
    return res
        .status(result.status)
        .json({ message: result.message, commentId: result === null || result === void 0 ? void 0 : result.commentId, reason: result === null || result === void 0 ? void 0 : result.reason });
});
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.originalUrl);
    const { indentLevel, comments, content } = req.body;
    const editObject = {
        indentLevel,
        comments,
        content,
    };
    const result = yield comments_services_1.default.editComment(editObject);
    return res.status(result.status).json({ message: result.message, reason: result === null || result === void 0 ? void 0 : result.reason });
});
const updateScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.originalUrl);
    const { indentLevel, comments, scoreUp } = req.body;
    const editObject = {
        indentLevel,
        comments,
        scoreUp,
    };
    const result = yield comments_services_1.default.editScore(editObject);
    return res.status(result.status).json({ message: result.message, reason: result === null || result === void 0 ? void 0 : result.reason });
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.originalUrl);
    const { indentLevel, comments } = req.body;
    const deleteObject = {
        indentLevel,
        comments,
    };
    const result = yield comments_services_1.default.deleteComment(deleteObject);
    return res.status(result.status).json({ message: result.message, reason: result === null || result === void 0 ? void 0 : result.reason });
});
exports.default = { getComments, addComment, editComment, updateScore, deleteComment };
