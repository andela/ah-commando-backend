// import sequelize from 'sequelize';
import models from '../db/models';
import utils from '../helpers/Utilities';

// const { Op } = sequelize;

/**
 * @Module BookmarkController
 * @description Controlls all activities related to bookmarks
 */
class BookmarkController {
  /**
   * @description Bookmarks an article for reading later
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} bookmarked article data
   */
  static async bookmarkArticle(req, res) {
    const userId = req.user.id;
    console.log('user object ===>', req.user);
    const { articleId } = req.params.slug;
    console.log('article id ===> ', articleId);

    const result = await models.Bookmark.findOrCreate({
      where: { articleId, userId },
      defaults: { articleId, userId }
    });
    console.log('bookmark ===> ', result);
    return utils.successStat(res, 201, 'bookmarks', result);
  }
}

export default BookmarkController;
