import { Request, Response } from 'express';
import format from 'date-fns/format';
import { CommentInterface } from '../model/comments';
import commentsServices from '../services/comments.services';

const getComments = async (req: Request, res: Response) => {};

const addComment = async (req: Request, res: Response) => {
    console.log(req.originalUrl);
    const { userId, image, nickname, message, tagUser, commentIndent } = req.body as CommentInterface;

    //check comments indent, if '0' then create new comment tree else assign comment to response field in given tree

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

const deleteComment = async (req: Request, res: Response) => {};

export default { getComments, addComment, updateComment, deleteComment };
