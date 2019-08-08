import models from '../db/models';
import utils from '../helpers/Utilities';

/**
 * @Module BookmarkController
 * @description Controlls all activities related to bookmarks
 */
class BookmarkController {
  /**
   * @description Bookmarks an article for reading later
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Success Message
   */
  static async bookmarkArticle(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const article = await models.Article.findByPk(articleId);
    if (!article) return utils.errorStat(res, 404, 'Article not found');
    const bookmarked = await models.Bookmark.findOne({ where: { articleId } });
    if (bookmarked) return utils.errorStat(res, 409, 'Aticle already bookmarked');
    const addBookmark = await models.Bookmark.findOrCreate({
      where: { articleId, userId },
      defaults: { articleId, userId }
    });
    return utils.successStat(res, 201, 'Bookmarked_article', addBookmark);
  }

  /**
   * @description Remove Article from Bookmark
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Success Message
   */
  static async unbookmarkArticle(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const article = await models.Article.findByPk(articleId);
    if (!article) return utils.errorStat(res, 404, 'Article not found');
    const bookmarked = await models.Bookmark.findOne({ where: { articleId } });
    if (!bookmarked) return utils.errorStat(res, 404, 'Article not found among bookmarks');
    await models.Bookmark.destroy({
      where: { articleId, userId },
      defaults: { articleId, userId }
    });
    return utils.successStat(res, 200, 'message', 'Article removed from bookmarks');
  }

  /**
   * @description Get all bookmarked Articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Bookmarked Articles
   */
  static async getBookmarkedArticles(req, res) {
    const userId = req.user.id;
    const bookmarks = await models.Bookmark.findAll({
      where: { userId }
    });
    if (bookmarks.length < 1) return utils.errorStat(res, 404, 'You have no bookmarked Article');
    return utils.successStat(res, 200, 'Bookmarks', bookmarks);
  }

  /**
   * @description Get all bookmarked Articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Bookmarked Articles
   */
  static async unbookmarkAllArticles(req, res) {
    const userId = req.user.id;
    const bookmarks = await models.Bookmark.findAll({
      where: { userId }
    });
    if (bookmarks.length < 1) return utils.errorStat(res, 404, 'You have no bookmarked articles to delete');
    await models.Bookmark.destroy({
      where: { userId },
      defaults: { userId }
    });
    return utils.successStat(res, 200, 'message', 'All bookmaked articles removed');
  }
}

export default BookmarkController;
