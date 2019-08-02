
const article = [
  {
    // correct data
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
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
    // no tagList
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
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
    // wrong title format
    article: {
      title: 'this is the@',
      description: 'article description one',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
      image: 'image.jpg'
    }
  },
  {
    // wrong description format
    article: {
      title: 'this is the',
      description: 'article description@',
      articleBody: 'this the body of the article',
      tagList: 'health programming',
      image: 'image.jpg'
    }
  },
  {
    // wrong articleBody format
    article: {
      title: 'this is the',
      description: 'article description',
      articleBody: 'this the body@',
      tagList: 'health programming',
      image: 'image.jpg'
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
];
export default article;
