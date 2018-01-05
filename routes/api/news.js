const router = require('koa-router')();
const mongoose = require('mongoose');
const News = require('../../models/News');

const debug = require('debug')('server:api');

// GET-запрос на /api/getNews - получение списка новостей. Необходимо вернуть список всех новостей из базы данных.
router.get('/getNews', async (ctx, next) => {
  // const params = ctx.request.body;
  debug('Get news');

  // todo - убрать загрузку всех полей пользователя user!
  // let news = await News.find().populate('user').exec(); // .then(doc => { return doc; });
  const news = await News.find().populate('user', 'id image').exec();

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

  try {
    await news.save();
  } catch (e) {
    ctx.throw(409, e.message);
  }

  ctx.status = 201;
  // ctx.body = news;
  // ctx.body = await News.findOne({ _id: news._id }).populate('user').exec();
  ctx.body = await News.find().populate('user', 'image').exec();
});

// PUT-запрос на /api/updateNews/:id - обновление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
router.put('/updateNews/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update news: id=${id}, params=`, params);

  let updateProps = {}; // const
  for (let key in params) {
    if (key) {
      if (key === 'userId') {
        updateProps['user'] = params[key];
      } else { // if key !== 'id'
        updateProps[key] = params[key];
      }
    }
  }

  try {
    await News.update({ _id: id }, { $set: updateProps }).exec();
  } catch (e) {
    ctx.throw(409, e.message);
  }

  // ctx.body = {}
  ctx.body = await News.find().populate('user', 'image').exec();
});

// DELETE-запрос на /api/deleteNews/:id - удаление существующей новости. Необходимо вернуть обновленный список всех новостей из базы данных.
router.delete('/deleteNews/:id', async (ctx, next) => {
  const id = ctx.params.id;
  debug(`Delete news: id=${id}`);

  try {
    await News.remove({ _id: id });
  } catch (e) {
    ctx.throw(409, e.message);
  }

  ctx.status = 204;
  // ctx.body = null;
  ctx.body = await News.find().populate('user', 'image').exec();
});

module.exports = router;
