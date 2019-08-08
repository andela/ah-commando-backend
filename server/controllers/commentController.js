import Sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';

const { successStat, errorStat } = helpers;

const { Op } = Sequelize;

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

  /**
   * @static
   * @description - get comments on a single article
   * @param {*} req - Request Object
   * @param {*} res - Response Object
   * @returns {object} - Object containing comments associated to a single post
   */
  static async getCommentsOnASingleArticle(req, res) {
    const { postId } = req.params;
    const post = await models.Article.findOne({ where: { id: postId } });
    if (!post) return errorStat(res, 404, 'post not found');
    const articleComments = await models.Comment.findAll({
      where: {
        articleId: postId
      },
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['username', 'firstname', 'image']
        },
        {
          model: models.Article,
          as: 'article',
          attributes: ['title']
        }
      ]
    });
    const commentsReturned = Object.values(articleComments).map(c => c.dataValues);
    const comments = commentsReturned.reverse();
    return successStat(res, 200, 'data', { comments, noOfComments: comments.length });
  }

  /**
   * @static
   * @description - edit own comment on an article
   * @param {*} req - Request body
   * @param {*} res - Response body
   * @returns {object} - Object containing updated comments
   */
  static async editOwnComment(req, res) {
    const { params: { commentId }, user } = req;
    const { comment } = req.body.comment;
    const foundComment = await models.Comment.findOne({
      where: {
        [Op.and]: [{ id: commentId }, { authorId: user.id }]
      }
    });
    if (!foundComment) return errorStat(res, 401, 'Not authorized to edit this comment');
    await models.Comment.update({ body: comment }, { where: { id: commentId } });
    const updatedComment = await models.Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['username', 'firstname', 'image']
        }
      ]
    });
    return successStat(res, 200, 'data', updatedComment);
  }

  /**
   * @static
   * @description - delete own comment on an article
   * @param {*} req - Request body
   * @param {*} res - Response body
   * @returns {object} - Object containing message
   */
  static async deleteOwnComment(req, res) {
    const { params: { commentId }, user } = req;
    const foundComment = await models.Comment.findOne({
      where: {
        [Op.and]: [{ id: commentId }, { authorId: user.id }]
      }
    });
    if (!foundComment) return errorStat(res, 401, 'Not authorized to delete this comment');
    await models.Comment.destroy({ where: { id: commentId } });
    return successStat(res, 200, 'message', 'Comment deleted successfully');
  }

  /**
   * @static
   * @description - get all comments made on all post by a user
   * @param {*} req - Request body
   * @param {*} res - Response body
   * @returns {object} - Object containing message
   */
  static async getAllCommentsForAllPosts(req, res) {
    const { user } = req;
    const userPosts = await models.Article.findAll({
      where: { authorId: user.id },
      attributes: ['title'],
      include: [
        {
          model: models.Comment,
          as: 'comment'
        }
      ]
    });
    if (userPosts.length <= 0) return successStat(res, 200, 'message', 'You have not made any post so far...');
    return successStat(res, 200, 'data', userPosts);
  }
}
