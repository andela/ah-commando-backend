import uuid from 'uuid';
import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';
import utils from '../helpers/Utilities';

import Paginate from '../helpers/paginate';

const { Op } = sequelize;
const { paginateArticles } = Paginate;
const { querySearch, filterSearch } = helpers;
/**
 * @Module ArticleController
 * @description Controlls all activities related to Articles
 */
class ArticleController {
  /**
   * @description Creates an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Article data
   * @memberof ArticleController
   */
  static async createArticle(req, res) {
    const {
      title,
      description,
      tagList,
      articleBody,
      image
    } = req.body.article;
    const readTime = Math.floor(articleBody.split(' ').length / 200);

    const article = await models.Article.create({
      title,
      description,
      tagList,
      articleBody,
      uuid: uuid.v1().split('-')[0],
      authorId: req.user.id,
      image,
      readTime
    });
    article.tagList = [...article.dataValues.tagList.split(' ')];
    return utils.successStat(res, 201, 'articles', article);
  }

  /**
   * @description returns all Articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} An array of all Articles
   * @memberof ArticleController
   */
  static async getAllArticles(req, res) {
    const { searchQuery } = req.query;
    const queryFilters = req.body;
    let articles;
    const { page, limit } = req.query;
    if (!page && !limit) {
      if (!searchQuery) {
        articles = await models.Article.findAll({
          include: [{ model: models.User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image', 'email'] }]
        });
      } else if (searchQuery && Object.keys(queryFilters)[0] !== 'undefined') {
        articles = await filterSearch(searchQuery, queryFilters);
      } else {
        articles = await querySearch(searchQuery);
      }
      return utils.successStat(res, 200, 'articles', articles);
    }
    paginateArticles(req, res);
  }

  /**
   * @description get a sinlge article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} returns a single article
   * @memberof ArticleController
   */
  static async getOneArticle(req, res) {
    const { slug } = req.params;
    const article = await models.Article.findOne({
      where: {
        slug,
      },
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['firstname', 'lastname', 'username', 'image', 'email']
      }]
    });
    if (!article) {
      return utils.errorStat(res, 404, 'Article not found');
    }
    let comments = await article.getComment();
    comments = Object.values(comments).map(comment => comment.dataValues);
    return utils.successStat(res, 200, 'article', { article, comments, noOfComments: comments.length });
  }

  /**
   * @description Edit an Article and returns the edited article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Edited article
   * @memberof ArticleController
   */
  static async editArticle(req, res) {
    const {
      title,
      description,
      articleBody,
      tagList,
      image
    } = req.body.article;
    const editedArticle = await models.Article.update(
      {
        title,
        description,
        articleBody,
        tagList,
        image
      },
      {
        returning: true,
        where: {
          [Op.and]: [{ slug: req.params.slug }, { authorId: req.user.id }]
        }
      }
    );

    if (editedArticle[1].length < 1) {
      return utils.errorStat(res, 404, 'Article not found');
    }

    const article = editedArticle[1][editedArticle[1].length - 1].dataValues;
    return utils.successStat(res, 200, 'article', article);
  }

  /**
   * @description Deletes an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async deleteArticle(req, res) {
    const deletedArticle = await models.Article.destroy({
      returning: true,
      where: {
        [Op.and]: [{ slug: req.params.slug }, { authorId: req.user.id }]
      }
    });

    if (!deletedArticle) {
      return utils.errorStat(res, 404, 'Article not found');
    }
    return utils.successStat(
      res,
      200,
      'message',
      'Article deleted successfully'
    );
  }
}

export default ArticleController;
