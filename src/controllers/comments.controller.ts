import { Request, Response } from 'express';
import format from 'date-fns/format';
import CommentsModel, { CommentInterface } from '../model/comments';
import commentsServices from '../services/comments.services';
import { deleteObjectInterface } from '../interfaces/apiInterfaces.interfaces';

const getComments = async (req: Request, res: Response) => {
    console.log(req.originalUrl);
    const result = await CommentsModel.find({}).exec();
    return res.status(200).json(result);
};

const addComment = async (req: Request, res: Response) => {
    console.log(req.originalUrl);
    const { userId, image, nickname, message, tagUser, commentIndent } = req.body as CommentInterface;

    let commentTree: CommentInterface = {
        userId,
        image,
        nickname,
        date: format(new Date(), 'yyyy.MM.dd.HH.mm.ss'),
        message,
        score: 0,
        tagUser,
        commentIndent,
        responses: [],
    };

    const result = await commentsServices.saveComment(commentTree);
    return res
        .status(result.status)
        .json({ message: result.message, commentId: result?.commentId, reason: result?.reason });
};

const updateComment = async (req: Request, res: Response) => {};

const deleteComment = async (req: Request, res: Response) => {
    console.log(req.originalUrl);
    const { indentLevel, comments } = req.body;
    const deleteObject = {
        indentLevel,
        comments,
    } as deleteObjectInterface;

    const result = await commentsServices.deleteComment(deleteObject);
    return res.status(result.status).json({ message: result.message, reason: result?.reason });
};

export default { getComments, addComment, updateComment, deleteComment };
