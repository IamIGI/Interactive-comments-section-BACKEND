import express from 'express';
import commentsController from '../../controllers/comments.controller';

const router = express.Router();

router.route('/all').get(commentsController.getComments);
router.route('/add').post(commentsController.addComment);
router.route('/delete').delete(commentsController.deleteComment);
router.route('/update').patch(commentsController.updateComment);

export = router;
