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
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = __importDefault(require("../model/comments"));
function saveComment(commentTree) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentIndent } = commentTree;
            if (commentIndent.level === 0) {
                //save as a new comment with indent = 0 (main comment)
                const newMainComment = new comments_1.default(commentTree);
                const result = yield newMainComment.save();
                return { status: 201, message: 'Comment added as parent comment', commentId: result._id };
            }
            else {
                const isExists = yield comments_1.default.findOne({
                    _id: new mongoose_1.default.Types.ObjectId(commentIndent.commentIds[0]),
                }).exec();
                if (!isExists)
                    return { status: 404, message: 'Could not find given comment' };
                //add another indent comment
                if (commentIndent.level === 1) {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(commentIndent.commentIds[0]) }, {
                        $push: {
                            responses: commentTree,
                        },
                    });
                }
                else {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(commentIndent.commentIds[0]) }, {
                        $push: {
                            'responses.$[comment].responses': commentTree,
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose_1.default.Types.ObjectId(commentIndent.commentIds[1]),
                            },
                        ],
                    });
                }
                return { status: 201, message: `Comment added as child comment, indent: ${commentIndent.level}` };
            }
        }
        catch (err) {
            return { status: 500, message: 'Could not save Item', reason: err };
        }
    });
}
function deleteComment(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExists = yield comments_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(object.comments[0]),
        }).exec();
        if (!isExists)
            return { status: 404, message: 'Could not find given comment' };
        try {
            if (object.indentLevel === 0) {
                yield comments_1.default.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) });
            }
            else {
                if (object.indentLevel === 1) {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $pull: {
                            responses: { _id: new mongoose_1.default.Types.ObjectId(object.comments[1]) },
                        },
                    });
                }
                else {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $pull: {
                            'responses.$[comment].responses': { _id: new mongoose_1.default.Types.ObjectId(object.comments[2]) },
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose_1.default.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    });
                }
            }
            return { status: 202, message: 'Comment deleted successfully!' };
        }
        catch (err) {
            return { status: 500, message: 'Could not delete comment', reason: err };
        }
    });
}
function editComment(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExists = yield comments_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(object.comments[0]),
        }).exec();
        if (!isExists)
            return { status: 404, message: 'Could not find given comment' };
        try {
            if (object.indentLevel === 0) {
                yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                    $set: {
                        message: object.content,
                        date: (0, format_1.default)(new Date(), 'yyyy.MM.dd.HH.mm.ss'),
                    },
                });
            }
            else {
                if (object.indentLevel === 1) {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $set: {
                            'responses.$[comment].message': object.content,
                            'responses.$[comment].date': (0, format_1.default)(new Date(), 'yyyy.MM.dd.HH.mm.ss'),
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose_1.default.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    });
                }
                else {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $set: {
                            'responses.$[comment1].responses.$[comment2].message': object.content,
                            'responses.$[comment1].responses.$[comment2].date': (0, format_1.default)(new Date(), 'yyyy.MM.dd.HH.mm.ss'),
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment1._id': new mongoose_1.default.Types.ObjectId(object.comments[1]),
                            },
                            {
                                'comment2._id': new mongoose_1.default.Types.ObjectId(object.comments[2]),
                            },
                        ],
                    });
                }
            }
            return { status: 202, message: 'Comment edited successfully!' };
        }
        catch (err) {
            return { status: 500, message: 'Could not edit comment', reason: err };
        }
    });
}
function editScore(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExists = yield comments_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(object.comments[0]),
        }).exec();
        if (!isExists)
            return { status: 404, message: 'Could not find given comment' };
        const increment = object.scoreUp ? 1 : -1;
        try {
            if (object.indentLevel === 0) {
                yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                    $inc: { score: increment },
                });
            }
            else {
                if (object.indentLevel === 1) {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $inc: {
                            'responses.$[comment].score': increment,
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose_1.default.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    });
                }
                else {
                    yield comments_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(object.comments[0]) }, {
                        $inc: {
                            'responses.$[comment1].responses.$[comment2].score': increment,
                        },
                    }, {
                        arrayFilters: [
                            {
                                'comment1._id': new mongoose_1.default.Types.ObjectId(object.comments[1]),
                            },
                            {
                                'comment2._id': new mongoose_1.default.Types.ObjectId(object.comments[2]),
                            },
                        ],
                    });
                }
            }
            return { status: 202, message: 'Comment score updated successfully!' };
        }
        catch (err) {
            return { status: 500, message: 'Could not update comment score', reason: err };
        }
    });
}
exports.default = { saveComment, deleteComment, editComment, editScore };
