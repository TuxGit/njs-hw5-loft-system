const router = require('koa-router')();

// render index/main page route
router.get('/([a-z0-9-_]*)', async (ctx, next) => {
  await ctx.render('index', {
  });
});

module.exports = router;
