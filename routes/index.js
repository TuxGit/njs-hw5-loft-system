const router = require('koa-router')();

router.get('/', async (ctx, next) => {
  await ctx.render('pages/index', {
  });
});

module.exports = router;
