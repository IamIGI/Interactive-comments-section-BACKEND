import express from 'express';
import commentsController from '../../controllers/comments.controller';

const router = express.Router();

router.route('/all').get(commentsController.getComments);
router.route('/add').post(commentsController.addComment);
router.route('/delete').patch(commentsController.deleteComment);
router.route('/edit').patch(commentsController.editComment);
router.route('/score').patch(commentsController.updateScore);

export = router;
