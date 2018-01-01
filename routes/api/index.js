const router = require('koa-router')();

const userRouter = require('./user');
const newsRouter = require('./news');

// api routes
router.use('/api',
  userRouter.routes(),
  newsRouter.routes()
);

module.exports = router;
