import mongoose from 'mongoose';

export interface CommentInterface {
    userId: string;
    image: string;
    nickname: string;
    date: string;
    message: string;
    likes?: {
        up: number;
        down: number;
    };
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
        likes?: {
            up: number;
            down: number;
        };
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
    likes: {
        up: {
            type: Number,
            default: 0,
        },
        down: {
            type: Number,
            default: 0,
        },
    },
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
});

const CommentsModel = mongoose.model<CommentDocument>('comments', commentSchema);

export default CommentsModel;
