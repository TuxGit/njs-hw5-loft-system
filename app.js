const path = require('path');

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const config = require('./etc/config.json');
// const DEBUG = process.env.DEBUG === 'true'; -> app.env === 'development'

// const mongooseMiddleware = require('koa-mongoose');
const mongooseMiddleware = require('./libs/koa-mongoose'); // tmp решение, пока не обновится npm пакет

// routes api - /api/*
const apiRouter = require('./routes/api');
// routes html pages - /*
const index = require('./routes/index');

/* head delimiter */

// error handler
onerror(app);

// middlewares
app.use(mongooseMiddleware(config.mongodb));
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  extendTypes: {
    json: ['text/plain'] // fix! - will parse text/plain type body as a JSON string
  }
}));
app.use(json({
  pretty: app.env === 'development'
})); // красиво выводит ответ json при отладке
app.use(logger());
app.use(require('koa-static')(path.join(__dirname, 'public')));

app.use(views(path.join(__dirname, 'views'), {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(apiRouter.routes(), apiRouter.allowedMethods());
app.use(index.routes(), index.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
