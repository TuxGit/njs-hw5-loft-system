const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const debug = require('debug')('server:api'); // http:api

// for upload files
const fs = require('fs');
const path = require('path');
const { uploadMulterMiddleware } = require('../../utils/middleware');

// const mongoose = require('mongoose');
const UserPermission = require('../../models/UserPermission');
const User = require('../../models/User');

const config = require('../../etc/config.json');

/* --- */

// POST-запрос на /api/authFromToken - авторизация при наличии токена. Необходимо вернуть объект авторизовавшегося пользователя.
router.post('/authFromToken', async (ctx, next) => {
  // body {"access_token": "value"}
  const params = ctx.request.body;
  debug('Login user with token: params=', params);

  let user = await User.findOne({
    access_token: params.access_token
  }).populate('permission'); // .exec() - вызывать?

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: 'Неверные параметры запроса'
    };
    return;
  }

  ctx.body = user;
});

// POST-запрос на /api/login - авторизация после пользователького ввода. Необходимо вернуть объект авторизовавшегося пользователя.
router.post('/login', async (ctx, next) => {
  // body {"username":"test","password":"test","remembered":true}
  const params = ctx.request.body;
  debug('Login user: params=', params);

  let filterParams = {
    username: params.username,
    password: crypto.createHash('md5').update(params.password).digest('hex')
  };
  let user = await User.findOne(filterParams)
    // .select('-__v')
    .populate('permission')
    .exec();

  if (user) {
    if (params.remembered === true) {
      ctx.cookies.set('access_token', user.access_token, {
        maxAge: ((config.cookie && config.cookie.timeout) || 60) * 60 * 1000,
        overwrite: true,
        httpOnly: false
      });
    }

    // ctx.body = user.toClient();
    // ctx.body = user.toJSON();
    ctx.body = user;
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 'Неверные логин и/или пароль!'
    };
  }
});

// GET-запрос на /api/getUsers - получение списка пользователей. Необходимо вернуть список всех пользоватлей из базы данных.
router.get('/getUsers', async (ctx, next) => {
  debug('Get users');

  ctx.body = await User.find().populate('permission').exec();
});

// POST-запрос на /api/saveNewUser - создание нового пользователя (регистрация). Необходимо вернуть объект созданного пользователя.
router.post('/saveNewUser', async (ctx, next) => {
  const params = ctx.request.body;
  debug('Create user: params=', params);

  const userPermission = new UserPermission(params.permission);
  await userPermission.save();

  let user = null;
  try {
    // const user = new User({
    user = new User({
      // _id: mongoose.Types.ObjectId(),
      username: params.username,
      password: crypto.createHash('md5').update(params.password).digest('hex'),
      firstName: params.firstName,
      surName: params.surName,
      middleName: params.middleName,
      access_token: uuidv4(),
      image: null, // params.img
      permissionId: userPermission._id
      // permission: params.permission // null
      // permission: {
      //   chat: { C: true, R: true, U: true, D: true },
      //   news: { C: true, R: true, U: true, D: true },
      //   setting: { C: true, R: true, U: true, D: true }
      // }
    });

    // let res = await user.save();
    await user.save();
  } catch (e) {
    // await UserPermission.remove({ _id: userPermission._id });
    await userPermission.remove();
    console.log(e.stack);
    ctx.status = 400;
    ctx.body = {
      error: e.message
    };
    return;
  }

  // console.log('Create user: ', params);
  ctx.status = 201;
  // ctx.body = user;
  ctx.body = await User.findOne({ _id: user._id }).populate('permission').select('-password').exec();
});

// PUT-запрос на /api/updateUser/:id - обновление информации о пользователе. Необходимо вернуть объект обновленного пользователя.
router.put('/updateUser/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update user: id=${id}, params=`, params);

  // if not found, exception : CastError: Cast to ObjectId failed for value "5a48bb751ed8ce23f4dd79e60" at path "_id" for model "User"
  let result = await User.update({ _id: id }, { $set: params });

  // console.log(`update user, id=${id}: `, result);
  ctx.body = await User.findOne({ _id: id }).exec();
});

// DELETE-запрос на /api/deleteUser/:id - удаление пользователя.
router.delete('/deleteUser/:id', async (ctx, next) => {
  const id = ctx.params.id;
  debug(`Delete user: id=${id}`);

  let result = await User.remove({ _id: id });
  // todo - if result? 204 else 404
  // console.log(`delete user, id=${id}: `, result);
  ctx.status = 204;
  // ctx.body = null;
});

// PUT-запрос на /api/updateUserPermission/:id - обновление существующей записи о разрешениях конкретного пользователя. (Более подробную информацию о url, дополнительных параметрах и передаваемых данных запроса вы можете получить через средства разработчика при взаимодействии с интерфейсом).
router.put('/updateUserPermission/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update user permissions: id=${id}, params=`, params);

  // await UserPermission.update({ _id: id }, { $set: params.permission });
  let userPermission = await UserPermission.findOne({ _id: id });
  for (let key in params.permission) {
    userPermission[key] = Object.assign({}, userPermission[key], params.permission[key]);
  }
  await userPermission.save();

  // ctx.body = await UserPermission.findOne({ _id: id });
  ctx.body = userPermission;
});

// POST-запрос на /api/saveUserImage/:id - сохранение изображения пользователя. Необходимо вернуть объект со свойством path, которое хранит путь до сохраненного изображения.
router.post('/saveUserImage/:id', uploadMulterMiddleware.any(), async (ctx, next) => {
  // todo:
  // 1 - удаление предыдущей аватарки (+)
  // 2 - компрессия и ресайз картинок (-)
  const id = ctx.params.id; // user id
  // !!! ctx.req.files
  const file = ctx.req.files[0];
  debug('Upload user image: ', file);

  if (file.originalname === '' || file.size === 0) {
    ctx.status = 400;
    ctx.body = {
      error: 'Картинка не загружена'
    };
    return;
  }

  const user = await User.findOne({ _id: id }).exec();
  if (user.image) {
    fs.unlinkSync(path.join(process.cwd(), 'public', user.image));
  }

  ctx.body = {
    path: file.path.replace(/\\/g, '/').replace(/^public\//, '')
  };
});

module.exports = router;
