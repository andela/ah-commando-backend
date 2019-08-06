import models from '../db/models';
import helpers from '../helpers';

const { successStat, errorStat } = helpers;

/**
  * @Module CommentController
  * @description Controlls comments made by users
  */
export default class CommentController {
  /**
     * @static
     * @param {*} req Request object
     * @param {*} res Response object
     * @returns {Object} Object containing the user comment, author, and timestaps
     * @memberof CommentController
     */
  static async addAComment(req, res) {
    const { params: { postId }, user } = req;
    const { comment } = req.body.comment;
    const post = await models.Article.findByPk(postId);
    if (!post) return errorStat(res, 404, 'Post not found');
    const newComment = {
      authorId: user.id,
      body: comment,
      articleId: postId
    };
    const userComment = await models.Comment.create(newComment);
    await post.addComment(userComment);
    const commentResponse = await models.Comment.findOne({
      where: { id: userComment.id },
      include: [
        {
          as: 'author',
          model: models.User,
          attributes: ['id', 'firstname', 'lastname', 'image', 'socialId', 'username']
        }
      ],
      attributes: {
        exclude: [
          'authorId'
        ]
      }
    });
    return successStat(res, 201, 'comment', commentResponse);
  }
}
