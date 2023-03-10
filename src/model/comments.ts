import mongoose from 'mongoose';

export interface CommentInterface {
    userId: string;
    image: string;
    nickname: string;
    date: string;
    message: string;
    score: number;
    tagUser: {
        isTrue: boolean;
        userId?: string;
        userName?: string;
    };
    commentIndent: {
        level: number;
        commentIds: string[];
    };
    responses: {
        userId: string;
        image: string;
        nickname: string;
        date: string;
        message: string;
        score: number;
        tagUser: {
            isTrue: boolean;
            userId?: string;
        };
        commentIndent: {
            level: number;
            commentIds: string[];
        };
    }[];
}

export interface CommentDocument extends CommentInterface, mongoose.Document {}

const Schema = mongoose.Schema;

export const commentSchema = new Schema();

commentSchema.add({
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
    responses: [commentSchema],
}); // adding schema to schema make it recursive

const CommentsModel = mongoose.model<CommentDocument>('comments', commentSchema);

export default CommentsModel;
