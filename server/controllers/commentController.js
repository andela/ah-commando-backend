import Sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';
import Notification from '../helpers/notifications';

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
    const author = await post.getAuthor({
      attributes: ['id', 'username', 'email', 'newPostEmailSub']
    });
    const payload = {
      resourceType: 'comment',
      resourceId: post.slug,
      message: `${commentResponse.author.username} commented on your article`,
    };
    Notification.notify([author], payload);
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
          attributes: ['username', 'firstname', 'lastname', 'image']
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
    return successStat(res, 200, 'data', userPosts);
  }

  /**
   * @static
   * @description allows a user add a comment to an already highlighted text
   * @param {*} req Request object
   * @param {*} res Response object
   * @returns {Object} Object containing the user comment, author, and timestaps
   * @memberof CommentController
   */
  static async commentAhighligh(req, res) {
    const { body: { highlight: { comment, id } }, user } = req;
    const highlightedComment = await models.Comment.findOne({ where: { highlightId: id } });
    if (!highlightedComment) return errorStat(res, 404, 'Post not found');
    const { highlightUser, articleId, highlightId } = highlightedComment;
    const newComment = {
      highlightUser,
      body: comment,
      articleId,
      highlightId,
      authorId: user.id,
    };
    const userComment = await models.Comment.create(newComment);
    return successStat(res, 201, 'comment', userComment);
  }

  /**
 * @static
 * @description returns all comments for a highlight
 * @param {*} req Request object
 * @param {*} res Response object
 * @returns {Object} Object containing the user comment, author, and timestaps
 * @memberof CommentController
 */
  static async getHighlightComment(req, res) {
    const { user, params: { id } } = req;
    const comments = await user.getComments({ where: { highlightId: id } });
    return successStat(res, 200, 'comment', comments);
  }
}
