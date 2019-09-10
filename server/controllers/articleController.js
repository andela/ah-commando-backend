import uuid from 'uuid';
import sequelize from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import helpers from '../helpers';
import Paginate from '../helpers/paginate';
import Notification from '../helpers/notifications';

dotenv.config();

const { Op } = sequelize;
const {
  querySearch, filterSearch, errorStat, successStat, addTags, addCategories,
} = helpers;

const { paginate } = Paginate;
const { Tags, Categories } = models;
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
      categoryList,
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
    if (tagList && tagList.length) {
      await addTags(tagList, article.dataValues.id);
    }
    if (categoryList && categoryList.length) {
      await addCategories(categoryList, article.dataValues.id);
    }
    article.tagList = tagList && tagList.split(/[ ,]/);
    const author = await article.getAuthor({
      attributes: ['username'],
      include: [{
        model: models.User,
        through: {
          attributes: []
        },
        as: 'followers',
        attributes: ['id', 'username', 'email', 'newPostEmailSub'],
      }],
    });

    const payload = {
      resourceType: 'article',
      resourceId: article.slug,
      message: `${author.username} just posted a new article`,
    };
    Notification.notify(author.followers, payload);
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
    const { searchQuery, authorId } = req.query;
    const queryFilters = req.body;

    let articles;
    const { page, limit } = req.query;
    if (!page && !limit) {
      if (!searchQuery) {
        articles = await models.Article.findAll({
          include: [
            { model: models.User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image', 'email'] },
            {
              model: models.Comment,
              as: 'comment'
            }
          ],
          group: ['Article.id', 'author.id', 'comment.id']
        });
        if (authorId) {
          articles = await models.Article.findAll({
            where: {
              authorId,
            },
            include: [
              { model: models.User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image', 'email'] },
              {
                model: models.Comment,
                as: 'comment'
              }
            ],
            group: ['Article.id', 'author.id', 'comment.id']
          });
        } else {
          articles = await models.Article.findAll({
            include: [
              { model: models.User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image', 'email'] },
              {
                model: models.Comment,
                as: 'comment'
              }
            ],
            group: ['Article.id', 'author.id', 'comment.id']
          });
        }
      } else if (searchQuery && Object.keys(queryFilters)[0] !== 'undefined') {
        articles = await filterSearch(searchQuery, queryFilters);
      } else {
        articles = await querySearch(searchQuery);
      }
      return successStat(res, 200, 'articles', articles);
    }
    paginate(page, limit, models.Article, 'articles', res, req, [
      { model: models.User, as: 'author', attributes: ['firstname', 'lastname', 'username', 'image', 'email'] },
      {
        model: models.Comment,
        as: 'comment'
      }
    ]);
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
      }, {
        model: models.Comment,
        as: 'comment',
      }],
      group: ['Article.id', 'author.id', 'comment.id']
    });

    if (!article) {
      return errorStat(res, 404, 'Article not found');
    }

    if (req.user) {
      const userId = req.user.id;
      await models.Reading.findOrCreate({
        where: { userId, articleId: article.id }
      });
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
        where: {
          [Op.and]: [{ slug: req.params.slug }, { authorId: req.user.id }]
        }
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
      where: {
        [Op.and]: [{ slug: req.params.slug }, { authorId: req.user.id }]
      }
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
   * @description Like or Dislike an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was liked or disliked
  */
  static async likeOrDislikeArticle(req, res) {
    const { user } = req;
    const { liked: likes, resourceId, type } = req.body.liked;
    const modelType = type.charAt(0).toUpperCase() + type.slice(1);

    const tableType = await models[modelType].findByPk(resourceId);
    if (!tableType) return errorStat(res, 404, `${tableType} not found`);

    const likedArticle = await models.Likes.findOne({
      where: { resourceId, userId: user.id }
    });

    if (likedArticle && likedArticle.likes === likes) {
      await models.Likes.destroy({ where: { resourceId, userId: user.id } });
    } else if (likedArticle && likedArticle.likes !== likes) {
      await models.Likes.update({ likes }, { where: { resourceId, userId: user.id } });
    } else {
      await user.createLike({
        likes,
        resourceId,
        type
      });
    }

    const totalLikes = await tableType.countLikes({
      where: { likes: true }
    });

    const totalDislikes = await tableType.countLikes({
      where: { likes: false }
    });

    await models[modelType].update({ likesCount: totalLikes, dislikesCount: totalDislikes },
      { where: { id: resourceId } });

    return successStat(res, 200, `${type}_Likes`, {
      likes: totalLikes,
      dislikes: totalDislikes
    });
  }

  /**
 * @static
 * @description Allows a user to highlight a Article text and add an optional comment
 * @param {*} req Request object
 * @param {*} res Response object
 * @returns {Object} Object containing the user comment, author, and timestaps
 * @memberof CommentController
 */
  static async highlightText(req, res) {
    const { body: { highlight: { comment, id, slug } }, user } = req;
    const post = await models.Article.findOne({
      where: {
        slug,
      }
    });
    if (!post) return errorStat(res, 404, 'Post not found');
    const newComment = {
      highlightUser: user.id,
      body: comment,
      articleId: post.id,
      highlightId: id,
      authorId: user.id,
    };
    const userComment = await models.Comment.create(newComment);
    await post.addComment(userComment);
    const commentResponse = await models.Comment.findOne({
      where: { id: userComment.id },
      include: [
        {
          as: 'author',
          model: models.User,
          attributes: ['firstname', 'lastname', 'image', 'username']
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
   * @description creates a new tag
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async createTag(req, res) {
    const { tagName, description } = req.body;
    const existingTag = await Tags.findOne({ where: { name: tagName } });
    if (existingTag) return errorStat(res, 409, 'Tag already exits');
    const tag = await Tags.create({ name: tagName, description });
    return successStat(res, 200, 'tag', tag);
  }

  /**
   * @description creates a new tag
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async createCategory(req, res) {
    const { categoryName, description } = req.body;
    const existingCategory = await Categories.findOne({ where: { name: categoryName } });
    if (existingCategory) return errorStat(res, 409, 'Category already exits');
    const category = await Categories.create({ name: categoryName, description });
    return successStat(res, 200, 'category', category);
  }

  /**
   * @description get all the tags in the database
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async getAllTags(req, res) {
    const tags = await Tags.findAll();
    return successStat(res, 200, 'tags', tags);
  }

  /**
   * @description get all the categories in the database
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async getAllCategories(req, res) {
    const categories = await Categories.findAll();
    return successStat(res, 200, 'categories', categories);
  }

  /**
   * @description sharing an article on facebook
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a link to the article on facebook website
  */
  static async shareOnFacebook(req, res) {
    const article = await models.Article.findOne({
      where: { slug: req.params.slug }
    });
    if (!article) {
      return errorStat(res, 404, 'not found');
    }
    const facebookSDK = `${process.env.FACEBOOK_SDK}${process.env.APP_URL}/api/v1/articles/${article.slug}`;
    return res.redirect(facebookSDK);
  }

  /**
   * @description sharing an article on tweeter
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a link to the article on twitter website
  */
  static async shareOnTweeter(req, res) {
    const article = await models.Article.findOne({
      where: { slug: req.params.slug }
    });
    if (!article) {
      return errorStat(res, 404, 'not found');
    }

    const tweetSDK = `${process.env.TWITTER_SDK}${process.env.APP_URL}/api/v1/articles/${article.slug}`;
    return res.redirect(tweetSDK);
  }

  /**
   * @description Gets the featured article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a link to the article on twitter website
  */
  static async getFeaturedArticles(req, res) {
    const article = await models.Article.findOne({
      attributes: [
        [sequelize.fn('max', sequelize.col('likesCount')), 'highestLikes']
      ],
    });
    const featuredArticle = await models.Article.findOne({
      where: { likesCount: article.dataValues.highestLikes },
      include: [{
        model: models.Comment,
        as: 'comment'
      },
      {
        as: 'author',
        model: models.User,
        attributes: ['firstname', 'lastname', 'image', 'username']
      }],
      group: ['Article.id']
    });
    return successStat(res, 200, 'article', featuredArticle);
  }

  /**
   * @description Gets the featured article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a link to the article on twitter website
  */
  static async getArticleCategories(req, res) {
    const { category } = req.query;
    let queryParameter = '';
    if (category) queryParameter = { name: category };
    const articleCategories = await models.Categories.findAll({
      where: queryParameter,
      include: {
        model: models.Article,
        include: [{
          model: models.User,
          as: 'author',
          attributes: ['firstname', 'lastname', 'image', 'username']
        },
        {
          model: models.Comment,
          as: 'comment'
        }]
      },
    });
    return successStat(res, 200, 'Categories', articleCategories);
  }

  /**
 * @description Gets the featured article
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {String} returns a link to the article on twitter website
*/
  static async getAllArticlesByTag(req, res) {
    const { articleTag } = req.body;

    const tag = await models.Tags.findOne({
      where: {
        name: articleTag
      }
    });

    if (!tag) return errorStat(res, 404, 'The tag does not exist');
    const tagId = tag.id;

    const articles = await models.Tags.findAll({
      where: {
        id: tagId
      },
      include: {
        model: models.Article,
        include: [{
          model: models.User,
          as: 'author',
          attributes: ['firstname', 'lastname', 'image', 'username']
        },
        {
          model: models.Comment,
          as: 'comment'
        },
        {
          model: models.Likes,
        }]
      },
    });

    return successStat(res, 200, 'Articles', articles);
  }
}

export default ArticleController;
