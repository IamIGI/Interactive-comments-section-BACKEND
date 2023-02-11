import mongoose from 'mongoose';
import CommentsModel, { CommentInterface, commentSchema } from '../model/comments';

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
                console.log(commentTree);
                await CommentsModel.findOneAndUpdate(
                    { _id: new mongoose.Types.ObjectId(commentIndent.commentIds[0]) },
                    {
                        $push: {
                            responses: commentTree,
                        },
                    }
                );
            } else {
                const result = await CommentsModel.updateOne(
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

export default { saveComment };
