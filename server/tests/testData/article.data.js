const article = [
  {
    // correct data
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
      categoryList: 'programming',
      image: 'image.jpg'
    }
  },
  {
    // no title
    article: {
      description: 'article description two',
      articleBody: 'this the body of the article',
      tagList: 'cars technology',
      image: 'image.jpg'
    }
  },
  {
    // no description
    article: {
      title: 'this is the first title',
      articleBody: 'this the body of the article',
      tagList: 'cars technology',
      image: 'image.jpg'
    }
  },
  {
    // no articleBody
    article: {
      title: 'this is the first title',
      description: 'article description two',
      tagList: 'cars technology',
      image: 'image.jpg'
    }
  },

  {
    // does not follow specified format
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 12343,
      image: 'image.jpg'
    }
  },

  {
    // no image
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
    }
  },
  {
    // wrong tagList format
    article: {
      title: 'this is the',
      description: 'article description',
      articleBody: 'this the body',
      tagList: 'health programming@',
      image: 'image.jpg'
    }
  },
  {
    // empty title
    article: {
      title: '',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
      image: 'image.jpg'
    }
  },
  {
    // correct data
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      categoryList: 'programming',
      image: 'image.jpg'
    }
  },
];
export default article;
