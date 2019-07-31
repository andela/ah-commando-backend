
const article = [
  {
    // correct data
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
  {
    // no title
    article: {
      description: 'article description two',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-second-title',
      tagList: 'cars technology',
      favoriteCounts: 4,
      image: 'image.jpg'
    }
  },
  {
    // no description
    article: {
      title: 'this is the first title',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-second-title',
      tagList: 'cars technology',
      favoriteCounts: 9,
      image: 'image.jpg'
    }
  },
  {
    // no articleBody
    article: {
      title: 'this is the first title',
      description: 'article description two',
      favorited: false,
      slug: 'this-is-the-second-title',
      tagList: 'cars technology',
      favoriteCounts: 74,
      image: 'image.jpg'
    }
  },
  {
    // favorited is not a boolean
    article: {
      title: 'this is the first title',
      description: 'article description two',
      articleBody: 'this the body of the article',
      slug: 'this-is-the-second-title',
      favorited: 'not a boolean',
      tagList: 'cars technology',
      favoriteCounts: 76,
      image: 'image.jpg'
    }
  },
  {
    // no tagList
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      favoriteCounts: 39,
      image: 'image.jpg'
    }
  },
  {
    // favoriteCounts is not an integer
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      favoriteCounts: 'not an integer',
      tagList: 'health programming',
      image: 'image.jpg'
    }
  },
  {
    // no image
    article: {
      title: 'this is the first title',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 95,
    }
  },

  {
    // wrong title format
    article: {
      title: 'this is the@',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
  {
    // wrong description format
    article: {
      title: 'this is the',
      description: 'article description@',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
  {
    // wrong articleBody format
    article: {
      title: 'this is the',
      description: 'article description',
      articleBody: 'this the body@',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
  {
    // wrong tagList format
    article: {
      title: 'this is the',
      description: 'article description',
      articleBody: 'this the body',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming@',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
  {
    // correct data
    article: {
      title: '',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },

  {
    // correct data
    article: {
      title: ' @/_ ',
      description: 'article description one',
      articleBody: 'this the body of the article',
      favorited: false,
      slug: 'this-is-the-first-title',
      tagList: 'health programming',
      favoriteCounts: 1,
      image: 'image.jpg'
    }
  },
];
export default article;
