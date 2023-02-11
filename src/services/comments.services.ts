import mongoose from 'mongoose';
import {
    deleteObjectInterface,
    editCommentObjectInterface,
    editCommentScoreObjectInterface,
} from '../interfaces/apiInterfaces.interfaces';
import CommentsModel, { CommentInterface } from '../model/comments';

async function saveComment(
    commentTree: CommentInterface
): Promise<{ status: number; message: string; commentId?: string; reason?: unknown }> {
    try {
        const { commentIndent } = commentTree;
        if (commentIndent.level === 0) {
            //save as a new comment with indent = 0 (main comment)
            const newMainComment = new CommentsModel(commentTree);
            const result = await newMainComment.save();
            return { status: 201, message: 'Comment added as parent comment', commentId: result._id };
        } else {
            const isExists = await CommentsModel.findOne({
                _id: new mongoose.Types.ObjectId(commentIndent.commentIds[0]),
            }).exec();
            if (!isExists) return { status: 404, message: 'Could not find given comment' };

            //add another indent comment
            if (commentIndent.level === 1) {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(commentIndent.commentIds[0]) },
                    {
                        $push: {
                            responses: commentTree,
                        },
                    }
                );
            } else {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(commentIndent.commentIds[0]) },
                    {
                        $push: {
                            'responses.$[comment].responses': commentTree,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose.Types.ObjectId(commentIndent.commentIds[1]),
                            },
                        ],
                    }
                );
            }

            return { status: 201, message: `Comment added as child comment, indent: ${commentIndent.level}` };
        }
    } catch (err) {
        return { status: 500, message: 'Could not save Item', reason: err };
    }
}

async function deleteComment(
    object: deleteObjectInterface
): Promise<{ status: number; message: string; reason?: any }> {
    const isExists = await CommentsModel.findOne({
        _id: new mongoose.Types.ObjectId(object.comments[0]),
    }).exec();
    if (!isExists) return { status: 404, message: 'Could not find given comment' };

    try {
        if (object.indentLevel === 0) {
            await CommentsModel.deleteOne({ _id: new mongoose.Types.ObjectId(object.comments[0]) });
        } else {
            if (object.indentLevel === 1) {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $pull: {
                            responses: { _id: new mongoose.Types.ObjectId(object.comments[1]) },
                        },
                    }
                );
            } else {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $pull: {
                            'responses.$[comment].responses': { _id: new mongoose.Types.ObjectId(object.comments[2]) },
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    }
                );
            }
        }
        return { status: 202, message: 'Comment deleted successfully!' };
    } catch (err) {
        return { status: 500, message: 'Could not delete comment', reason: err };
    }
}

async function editComment(
    object: editCommentObjectInterface
): Promise<{ status: number; message: string; reason?: any }> {
    const isExists = await CommentsModel.findOne({
        _id: new mongoose.Types.ObjectId(object.comments[0]),
    }).exec();
    if (!isExists) return { status: 404, message: 'Could not find given comment' };

    try {
        if (object.indentLevel === 0) {
            await CommentsModel.updateOne(
                { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                {
                    $set: {
                        message: object.content,
                    },
                }
            );
        } else {
            if (object.indentLevel === 1) {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $set: {
                            'responses.$[comment].message': object.content,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    }
                );
            } else {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $set: {
                            'responses.$[comment1].responses.$[comment2].message': object.content,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment1._id': new mongoose.Types.ObjectId(object.comments[1]),
                            },
                            {
                                'comment2._id': new mongoose.Types.ObjectId(object.comments[2]),
                            },
                        ],
                    }
                );
            }
        }
        return { status: 202, message: 'Comment edited successfully!' };
    } catch (err) {
        return { status: 500, message: 'Could not edit comment', reason: err };
    }
}

async function editScore(
    object: editCommentScoreObjectInterface
): Promise<{ status: number; message: string; reason?: any }> {
    const isExists = await CommentsModel.findOne({
        _id: new mongoose.Types.ObjectId(object.comments[0]),
    }).exec();
    if (!isExists) return { status: 404, message: 'Could not find given comment' };

    const increment = object.scoreUp ? 1 : -1;

    try {
        if (object.indentLevel === 0) {
            await CommentsModel.updateOne(
                { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                {
                    $inc: { score: increment },
                }
            );
        } else {
            if (object.indentLevel === 1) {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $inc: {
                            'responses.$[comment].score': increment,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment._id': new mongoose.Types.ObjectId(object.comments[1]),
                            },
                        ],
                    }
                );
            } else {
                await CommentsModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(object.comments[0]) },
                    {
                        $inc: {
                            'responses.$[comment1].responses.$[comment2].score': increment,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                'comment1._id': new mongoose.Types.ObjectId(object.comments[1]),
                            },
                            {
                                'comment2._id': new mongoose.Types.ObjectId(object.comments[2]),
                            },
                        ],
                    }
                );
            }
        }
        return { status: 202, message: 'Comment score updated successfully!' };
    } catch (err) {
        return { status: 500, message: 'Could not update comment score', reason: err };
    }
}

export default { saveComment, deleteComment, editComment, editScore };
