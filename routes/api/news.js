const router = require('koa-router')();
const mongoose = require('mongoose');
const News = require('../../models/News');

const debug = require('debug')('server:api');

// GET-запрос на /api/getNews - получение списка новостей. Необходимо вернуть список всех новостей из базы данных.
router.get('/getNews', async (ctx, next) => {
  // const params = ctx.request.body;
  debug('Get news');

  // todo - убрать загрузку всех полей пользователя user!
  let news = await News.find().populate('user').exec();

  if (news) {
    ctx.body = news;
  }
});

// POST-запрос на /api/newNews - создание новой новости. Необходимо вернуть обновленный список всех новостей из базы данных.
router.post('/newNews', async (ctx, next) => {
  const params = ctx.request.body;
  debug('Create news: params=', params);

  const news = new News({
    _id: mongoose.Types.ObjectId(),
    theme: params.theme,
    text: params.text,
    date: params.date,
    // userId: params.userId
    user: params.userId
  });

  await news.save();

  ctx.status = 201;
  // ctx.body = news;
  // ctx.body = await News.findOne({ _id: news._id }).populate('user').exec();
  ctx.body = await News.find().populate('user').exec();
});

// PUT-запрос на /api/updateNews/:id - обновление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
router.put('/updateNews/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update news: id=${id}, params=`, params);

  let updateProps = {};
  for (let key in params) {
    if (key) {
      if (key === 'userId') {
        updateProps['user'] = params[key];
      } else { // if key !== 'id'
        updateProps[key] = params[key];
      }
    }
  }

  let result = await News.update({ _id: id }, { $set: updateProps }).exec();
  // console.log(`update news, id=${id}: `, result);
  // console.log(ctx);
  // ctx.body = {}
  ctx.body = await News.find().populate('user').exec();
});

// DELETE-запрос на /api/deleteNews/:id - удаление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
router.delete('/deleteNews/:id', async (ctx, next) => {
  const id = ctx.params.id;
  debug(`Delete news: id=${id}`);

  let result = await News.remove({ _id: id });
  // todo - if result? 204 else 404
  // console.log(`delete news, id=${id}: `, result);
  ctx.status = 204;
  // ctx.body = null;
  ctx.body = await News.find().populate('user').exec();
});

module.exports = router;
