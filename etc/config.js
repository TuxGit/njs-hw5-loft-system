module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  cookie: {
    timeout: process.env.COOKIE_TIMEOUT
  },
  // todo -
  user_image: {
    max_width: 350,
    max_height: 350,
    quality: 80
  }
};
