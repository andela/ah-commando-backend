import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiInteger from 'chai-integer';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import app from '../index';
import articleData from './testData/article.data';


dotenv.config();
const { expect } = chai;
chai.use(chaiHttp);
chai.use(chaiInteger);

const baseUrl = '/api/v1';
const wrongToken = 'wrongtoken';


let userToken;
describe('Article test', () => {
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/users`)
      .send({
        user: {
          firstname: 'test',
          lastname: 'testlastname',
          username: 'testusername1',
          email: 'test1@testdomain.com',
          password: 'P@ssword123'
        }
      })
      .end((err, res) => {
        const {
          user: { token }
        } = res.body;
        userToken = token;
        done();
      });
  });

  describe('Create Article tests', () => {
    it('it should return error if no token is provided', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .send(articleData[0])
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(401);
          done();
        });
    });

    it('it should return error if wrong token is supplied', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .send(articleData[0].article)
        .set('Authorization', `Bearer ${wrongToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(401);
          done();
        });
    });

    it('should not create an article if the supplied ID is wrong', (done) => {
      const user = jwt.verify(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });
      user.id = 2560;
      const newToken = jwt.sign(user, process.env.SECRET_KEY);
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${newToken}`)
        .send(articleData[0])
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('should create an article', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[0])
        .end((err, res) => {
          const { status, articles } = res.body;
          expect(status).to.equal(201);
          expect(articles).to.have.property('readTime');
          expect(articles.readTime).to.be.an.integer();
          done();
        });
    });

    it('should dislike an article', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/likes/1`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          liked: {
            liked: 'false',
            type: 'article'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should like an article', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/likes/1`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          liked: {
            liked: 'true',
            type: 'article'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should unlike an already liked article', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/likes/1`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          liked: {
            liked: 'true',
            type: 'article'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should should return an error if no article is found', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/likes/1000`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          liked: {
            liked: 'true',
            type: 'article'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('should create an article without tagList', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[8])
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(201);
          done();
        });
    });


    it('should get all articles', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should get articles by tag', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles/tag/get-article`)
        .send({
          tag: {
            articleTag: 'javascript'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should return error if the tag doesnot exist', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles/tag/get-article`)
        .send({
          tag: {
            articleTag: 'minimemeneie'
          }
        })
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('get all articles by categories', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/categories/article`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('get all articles by a single categories', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/categories/article?category=technology`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('get featured article', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/categories/article/featured`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should get all articles belonging to a specific user', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles?authorId=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should get all articles with pagination', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/?limit=1&page=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should get all articles with pagination if no limit is provided', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/?page=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('should return a 404 if a page that does not exist is entered', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/?limit=1&page=1500`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('should get all articles with pagination if no page is provided', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/?limit=1`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });


    it('should get a single article', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/this-is-the-first-title`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('get single article: should throw an error if article does not exist', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/articles/44`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('should edit a single article', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/articles/this-is-the-first-title/edit`)
        .send({ article: { title: 'new title' } })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('edit single article: should throw an error if article does not exist', (done) => {
      chai
        .request(app)
        .put(`${baseUrl}/articles/wrongslug/edit`)
        .send({ article: { title: 'new title' } })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('should delete an article', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/articles/this-is-the-first-title`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });

    it('delete article: should throw an error if article does not exist', (done) => {
      chai
        .request(app)
        .delete(`${baseUrl}/articles/44`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(404);
          done();
        });
    });

    it('no title: should throw an error if title is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[1])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('title is required');
          done();
        });
    });

    it('no description: should throw an error if description is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[2])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('description is required');
          done();
        });
    });

    it('no articleBody: should throw an error if articleBody is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[3])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('articleBody is required');
          done();
        });
    });

    it('should return 400 if a string', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[4])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('tagList must be a string');
          done();
        });
    });
    it('no image: should throw an error if image is not provided', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[5])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('image is required');
          done();
        });
    });

    it('wrong taglist format: should throw an error if description has incorrect format', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(articleData[6])
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(400);
          expect(error[0]).to.equal('taglist does not follow the specified format');
          done();
        });
    });

    it('Should upload Image successfully to cloudinary', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/image`)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('image', path.join(__dirname, './testData/img/andela.png'))
        .end((err, res) => {
          const { status } = res.body;
          expect(status).to.equal(200);
          done();
        });
    });
  });


  describe('Highlight and comment on a post', () => {
    it('Should allow a user highlight a text and comment on it', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles/the-title/highlight`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          highlight: {
            id: 1,
            comment: 'I love this line you wrote here'
          }
        })
        .end((err, res) => {
          const { status, comment } = res.body;
          expect(status).to.equal(201);
          expect(comment).to.not.equal(null);
          done();
        });
    });

    it('Should throw an error if the article is not found', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/articles/the-titles-not-available/highlight`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          highlight: {
            id: 1,
            comment: 'I love this line you wrote here'
          }
        })
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('Post not found');
          done();
        });
    });

    it('Should allow a comment on an already existing highlight', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/comment/1/highlight`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          highlight: {
            comment: 'Yes I really do'
          }
        })
        .end((err, res) => {
          const { status, comment } = res.body;
          expect(status).to.equal(201);
          expect(comment).to.not.equal(null);
          done();
        });
    });

    it('Should throw an error if the highligh is not found', (done) => {
      chai
        .request(app)
        .post(`${baseUrl}/comment/100/highlight`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          highlight: {
            comment: 'yes I do too'
          }
        })
        .end((err, res) => {
          const { status, error } = res.body;
          expect(status).to.equal(404);
          expect(error).to.equal('Post not found');
          done();
        });
    });

    it('Should get all the comments for an article', (done) => {
      chai
        .request(app)
        .get(`${baseUrl}/comment/1/highlight`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const { status, comment } = res.body;
          expect(status).to.equal(200);
          expect(comment).to.not.equal(null);
          done();
        });
    });
  });

  describe('Search for an article', () => {
    it('Should return 400 if categories is a number', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter`)
        .send({
          categories: 543234
        })
        .end((err, res) => {
          expect(res.body).to.have.a.status(400);
          expect(res.body).to.include.all.keys('status', 'error');
          expect(res.body.error[0]).to.be.equal('categories must be a string');
          done();
        });
    });
    it('Should return 400 if searchQuery is less than two characters', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=a`)
        .send({
          categories: 'technoloy'
        })
        .end((err, res) => {
          expect(res.body).to.have.a.status(400);
          expect(res.body).to.include.all.keys('status', 'error');
          expect(res.body.error[0]).to.be.equal('searchQuery length must be at least 2 characters long');
          done();
        });
    });
    it('Should return 400 if authorNames is a number', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter`)
        .send({
          authorNames: 543234
        })
        .end((err, res) => {
          expect(res).to.have.a.status(400);
          expect(res.body).to.include.all.keys('status', 'error');
          expect(res.body.error[0]).to.be.equal('authorNames must be a string');
          done();
        });
    });
    it('Should return 400 if authorNames is a number', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter`)
        .send({
          tags: 543234
        })
        .end((err, res) => {
          expect(res).to.have.a.status(400);
          expect(res.body).to.include.all.keys('status', 'error');
          expect(res.body.error[0]).to.be.equal('tags must be a string');
          done();
        });
    });
    it('Should return 400 if limit or page is not a number', (done) => {
      chai.request(app)
        .get(`${baseUrl}/articles?limit=erwer`)
        .end((err, res) => {
          expect(res).to.have.a.status(400);
          expect(res.body).to.include.all.keys('status', 'error');
          expect(res.body.error[0]).to.be.equal('limit must be a number');
          done();
        });
    });
    it('Should get all articles with search query provided', (done) => {
      chai.request(app)
        .get(`${baseUrl}/articles?searchQuery=on`)
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.rows).to.be.an('array');
          expect(res.body.articles.rows[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles with search query provided include limit and/or page', (done) => {
      chai.request(app)
        .get(`${baseUrl}/articles?searchQuery=on&limit=20&page=1`)
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.data).to.be.an('array');
          expect(res.body.articles.data[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles with the query string an categories listed', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=an`)
        .send({
          categories: 'technology,health,fashion,lifestyle,education,science,culture'
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.rows).to.be.an('array');
          expect(res.body.articles.rows[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles that include the query string and the tag(s) listed', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=an`)
        .send({
          tags: 'javascript,love,ai,react,tutorial,believe,travel'
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.rows).to.be.an('array');
          expect(res.body.articles.rows[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles that include the query string ad the tag(s) listed including limit and/or page', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=an&limit=10&page=1`)
        .send({
          tags: 'javascript,love,ai,react,tutorial,believe,travel'
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.data).to.be.an('array');
          expect(res.body.articles.data[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles with query string, the categories and the tags', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=an`)
        .send({
          categories: 'fashion,technology,health,lifestyle,education,culture',
          tags: 'believe,race,react,tutorial,knowledge,javascript'
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.rows).to.be.an('array');
          expect(res.body.articles.rows[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
    it('Should get all articles with the query string, categories, tags and authorName', (done) => {
      chai.request(app)
        .post(`${baseUrl}/articles/search/filter?searchQuery=an`)
        .send({
          categories: 'fashion,technology,health,fashion,lifestyle,education,culture',
          tags: 'believe,race,react,tutorial,knowledge,javascript,ai,travel',
          authorNames: 'dominic,monday,jude,kafilat,chukwudi,martins,malik'
        })
        .end((err, res) => {
          expect(res).to.have.a.status(200);
          expect(res.body).to.include.all.keys('status', 'articles');
          expect(res.body.articles.rows).to.be.an('array');
          expect(res.body.articles.rows[0]).to.include.all.keys('title', 'articleBody', 'description', 'author', 'Categories', 'Tags');
          done();
        });
    });
  });
});

describe('create or get all tags and categories', () => {
  it('Should get all the tags in the database', (done) => {
    chai.request(app)
      .get(`${baseUrl}/articles/tags/get`)
      .end((err, res) => {
        expect(res.body).to.have.a.status(200);
        expect(res.body).to.include.all.keys('status', 'tags');
        expect(res.body.tags).to.be.an('array');
        expect(res.body.tags[0]).to.include.all.keys('name', 'description');
        done();
      });
  });
  it('Should get all the categories in the database', (done) => {
    chai.request(app)
      .get(`${baseUrl}/articles/categories/get`)
      .end((err, res) => {
        expect(res.body).to.have.a.status(200);
        expect(res.body).to.include.all.keys('status', 'categories');
        expect(res.body.categories).to.be.an('array');
        expect(res.body.categories[0]).to.include.all.keys('name', 'description');
        done();
      });
  });
  it('should create a new tag in the database', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles/tags/create`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        tagName: 'newtag',
        description: 'this is a new tag'
      })
      .end((err, res) => {
        expect(res.body).to.have.a.status(200);
        expect(res.body.tag).to.include.all.keys('name', 'description');
        done();
      });
  });
  it('should return 409 if the tag already exits', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles/tags/create`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        tagName: 'newtag',
        description: 'this is a new tag'
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(409);
        expect(error).to.equal('Tag already exits');
        done();
      });
  });
  it('should create a new category in the database', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles/categories/create`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        categoryName: 'newCategory',
        description: 'this is a new category'
      })
      .end((err, res) => {
        expect(res.body).to.have.a.status(200);
        expect(res.body.category).to.include.all.keys('name', 'description');
        done();
      });
  });
  it('should return 409 is category already exits', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles/categories/create`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        categoryName: 'newCategory',
        description: 'this is a new category'
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).to.equal(409);
        expect(error).to.equal('Category already exits');
        done();
      });
  });
});

describe('social media sharing', () => {
  let articleSlug;
  const wrongSlug = 'wrong slug';
  before((done) => {
    chai
      .request(app)
      .post(`${baseUrl}/articles`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        article: {
          title: 'share on facebook',
          description: 'description',
          articleBody: 'article body',
          tagList: 'android dragons',
          image: 'image.png'
        }
      })
      .end((err, res) => {
        const {
          articles: { slug }
        } = res.body;
        articleSlug = slug;
        done();
      });
  });

  it('should share an article on facebook', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/${articleSlug}/facebook-share`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { redirects } = res;
        expect(redirects[0]).to.equal(`https://www.facebook.com/sharer/sharer.php?u=${process.env.APP_URL}/api/v1/articles/share-on-facebook`);
        done();
      });
  });

  it('should throw an error if article does not exist', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/${wrongSlug}/facebook-share`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });

  it('should share an article on twitter', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/${articleSlug}/twitter-share`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { redirects } = res;
        expect(redirects[0]).to.equal(`https://twitter.com/share?url=${process.env.APP_URL}/api/v1/articles/share-on-facebook`);
        done();
      });
  });

  it('should throw an error if article does not exist', (done) => {
    chai
      .request(app)
      .get(`${baseUrl}/articles/${wrongSlug}/twitter-share`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        const { status } = res.body;
        expect(status).to.equal(404);
        done();
      });
  });
});
