"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const comments_controller_1 = __importDefault(require("../../controllers/comments.controller"));
const router = express_1.default.Router();
router.route('/all').get(comments_controller_1.default.getComments);
router.route('/add').post(comments_controller_1.default.addComment);
router.route('/delete').patch(comments_controller_1.default.deleteComment);
router.route('/edit').patch(comments_controller_1.default.editComment);
router.route('/score').patch(comments_controller_1.default.updateScore);
module.exports = router;
