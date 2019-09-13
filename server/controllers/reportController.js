import sequelize from 'sequelize';
import models from '../db/models';
import utils from '../helpers/Utilities';


const { Op } = sequelize;
/**
 * @Module ArticleController
 * @description Controlls all activities related to Articles
 */
class reportController {
  /**
   * @description Creates an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Article data
   * @memberof ArticleController
   */
  static async reportArticle(req, res) {
    const article = await models.Article.findOne({
      where: {
        slug: req.params.slug
      },
      attributes: {
        exclude: ['tagList'],
      },
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['firstname', 'lastname', 'username', 'image', 'email']
      },
      {
        model: models.Categories, attributes: ['name'], through: { attributes: [] }, duplicating: false
      },
      {
        model: models.Tags, attributes: ['name'], through: { attributes: [] }, duplicating: false
      }]
    });
    if (!article) {
      return utils.errorStat(res, 404, 'Article not found');
    }

    if (article) {
      const authorId = req.user.id;
      const articleId = article.id;
      const { reportDetails, reportType } = req.body.report;
      const findReport = await models.Report.findOne({
        where: { authorId, articleId }
      });

      if (!findReport) {
        const report = await models.Report.create({
          reportDetails,
          reportType,
          authorId,
          articleId
        });
        if (report) {
          return utils.successStat(res, 201, 'report', report);
        }
      }
      return utils.errorStat(res, 409, 'article already reported by you');
    }
  }

  /**
   * @description Creates an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Article data
   * @memberof ReportController
   */
  static async getAllArticleReports(req, res) {
    const allReports = await models.Report.findAll({
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: [
            'firstname',
            'lastname',
            'username',
            'image',
            'email'
          ]
        },
        {
          model: models.Article,
          attributes: [
            'title',
            'description',
            'articleBody',
            'image',
            'tagList',
            'slug'
          ]
        }
      ]
    });
    return utils.successStat(res, 200, 'reports', allReports);
  }

  /**
   * @description Creates an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Article data
   * @memberof ReportController
   */
  static async getOneReport(req, res) {
    const report = await models.Report.findOne({
      where: {
        [Op.and]: [{ id: req.params.reportId }, { authorId: req.user.id }]
      },
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: [
            'firstname',
            'lastname',
            'username',
            'image',
            'email'
          ]
        },
        {
          model: models.Article,
          attributes: [
            'title',
            'description',
            'articleBody',
            'image',
            'tagList',
            'slug'
          ]
        }
      ]
    });
    if (!report) return utils.errorStat(res, 404, 'Report not found');
    return utils.successStat(res, 200, 'report', report);
  }
}


export default reportController;
