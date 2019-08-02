import uuid from 'uuid';
import sequelize from 'sequelize';
import models from '../db/models';
import helpers from '../helpers';

const { successStat, errorStat } = helpers;

const { Op } = sequelize;
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
      favorited,
      favoriteCounts,
      image
    } = req.body.article;

    const article = await models.Article.create({
      title,
      description,
      tagList,
      articleBody,
      favorited,
      uuid: uuid.v1().split('-')[0],
      favoriteCounts,
      authorId: req.user.id,
      image
    });
    const userData = await models.Article.findOne({
      where: { authorId: req.user.id },
      include: [
        {
          model: models.User,
          attributes: {
            exclude: [
              'id',
              'createdAt',
              'updatedAt',
              'firstname',
              'lastname',
              'password'
            ]
          }
        }
      ]
    });
    const userDetails = JSON.parse(JSON.stringify(userData));
    article.tagList = [...article.dataValues.tagList.split(' ')];
    article.author = {
      username: userDetails.User.username,
      email: userDetails.User.email,
      bio: userDetails.User.bio,
      image: userDetails.User.image
    };
    return successStat(res, 201, 'articles', article);
  }

  /**
   * @description returns all Articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} An array of all Articles
   * @memberof ArticleController
   */
  static async getAllArticles(req, res) {
    const articles = await models.Article.findAll();
    return successStat(res, 200, 'articles', articles);
  }

  /**
   * @description get a sinlge article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} returns a single article
   * @memberof ArticleController
   */
  static async getOneArticle(req, res) {
    const article = await models.Article.findOne({
      where: { slug: req.params.slug }
    });
    if (!article) {
      return errorStat(res, 404, 'Article not found');
    }
    return successStat(res, 200, 'article', article);
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
        where: { [Op.and]: [{ slug: req.params.slug }] }
      }
    );

    if (editedArticle[1].length < 1) {
      return errorStat(res, 404, 'Article not found');
    }

    const article = editedArticle[1][editedArticle[1].length - 1].dataValues;
    return successStat(res, 200, 'article', article);
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
      where: { [Op.and]: [{ slug: req.params.slug }] }
    });

    if (!deletedArticle) {
      return errorStat(res, 404, 'Article not found');
    }
    return successStat(
      res,
      200,
      'message',
      'Article deleted successfully'
    );
  }

  /**
   * @description Allows the user to rate an article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async rateArticle(req, res) {
    const { body: { rating: { rate, articleId, description } }, user } = req;
    const theUser = await models.User.findByPk(user.id);
    const hasArticle = await theUser.hasArticle(articleId);
    console.log(user.id);
    if (hasArticle) {
      return errorStat(res, 400, 'Cannot rate own Article!');
    }
    try {
      const userRating = await theUser.createRating({
        ratings: rate,
        articleId,
        description
      });
      successStat(res, 201, 'User Rating', userRating);
    } catch (err) {
      errorStat(res, 200, 'Rating already Recorded');
    }
  }
}

export default ArticleController;
