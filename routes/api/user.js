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

const { resizeImage } = require('../../utils/image');

const config = require('../../etc/config.json');

/* --- */

// POST-запрос на /api/authFromToken - авторизация при наличии токена. Необходимо вернуть объект авторизовавшегося пользователя.
router.post('/authFromToken', async (ctx, next) => {
  // body {"access_token": "value"}
  const params = ctx.request.body;
  debug('Login user with token: params=', params);

  const user = await User.findOne({
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

  const filterParams = {
    username: params.username,
    password: crypto.createHash('md5').update(params.password).digest('hex')
  };
  const user = await User.findOne(filterParams).populate('permission').exec();

  if (user) {
    if (params.remembered === true) {
      ctx.cookies.set('access_token', user.access_token, {
        maxAge: ((config.cookie && config.cookie.timeout) || 60) * 60 * 1000,
        overwrite: true,
        httpOnly: false
      });
    }

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
  // const user = new User({
  try {
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
    });

    await user.save();
  } catch (e) {
    await userPermission.remove();
    console.log(e.stack);
    ctx.status = 409;
    ctx.body = {
      error: e.message
    };
    return;
  }

  ctx.status = 201;
  // ctx.body = user;
  ctx.body = await User.findOne({ _id: user._id }).populate('permission').select('-password').exec();
});

// PUT-запрос на /api/updateUser/:id - обновление информации о пользователе. Необходимо вернуть объект обновленного пользователя.
router.put('/updateUser/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update user: id=${id}, params=`, params);

  let filterParams = { _id: id }; // const
  // oldPassword, password
  if (params.password) {
    if (!params.oldPassword) {
      ctx.status = 400;
      ctx.body = {
        error: 'Неправильные параметры смены пароля'
      };
      return;
    }
    filterParams['password'] = crypto.createHash('md5').update(params.oldPassword).digest('hex');
    params['password'] = crypto.createHash('md5').update(params.password).digest('hex');
  }

  try {
    // можно сначала получить запись, а потом обновлять её (можно выловить ошибку 404? - запись не найдена)
    await User.update(filterParams, { $set: params }); // .exec() - вызывать?
  } catch (e) {
    // if not found, exception : CastError: Cast to ObjectId failed for value "5a48bb751ed8ce23f4dd79e60" at path "_id" for model "User"
    console.log(e.stack);
    ctx.status = 409;
    ctx.body = {
      error: e.message
    };
    return;
  }

  ctx.body = await User.findOne({ _id: id }).exec();
});

// DELETE-запрос на /api/deleteUser/:id - удаление пользователя.
router.delete('/deleteUser/:id', async (ctx, next) => {
  const id = ctx.params.id;
  debug(`Delete user: id=${id}`);

  const user = await User.findOne({ _id: id }).exec();
  try {
    await UserPermission.remove({ _id: user.permissionId });
    await User.remove({ _id: id }); // .exec() - вызывать?
  } catch (e) {
    console.log(e.stack);
    ctx.status = 409;
    ctx.body = {
      error: e.message
    };
    return;
  }

  ctx.status = 204;
  // ctx.body = null;
});

// PUT-запрос на /api/updateUserPermission/:id - обновление существующей записи о разрешениях конкретного пользователя. (Более подробную информацию о url, дополнительных параметрах и передаваемых данных запроса вы можете получить через средства разработчика при взаимодействии с интерфейсом).
router.put('/updateUserPermission/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const params = ctx.request.body;
  debug(`Update user permissions: id=${id}, params=`, params);

  const userPermission = await UserPermission.findOne({ _id: id }).exec();
  for (let key in params.permission) {
    userPermission[key] = Object.assign({}, userPermission[key], params.permission[key]);
  }

  try {
    await userPermission.save();
  } catch (e) {
    console.log(e.stack);
    ctx.status = 409;
    ctx.body = {
      error: e.message
    };
    return;
  }

  // ctx.body = await UserPermission.findOne({ _id: id });
  ctx.body = userPermission;
});

// POST-запрос на /api/saveUserImage/:id - сохранение изображения пользователя. Необходимо вернуть объект со свойством path, которое хранит путь до сохраненного изображения.
router.post('/saveUserImage/:id', uploadMulterMiddleware.any(), async (ctx, next) => {
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

  // optimize user image (avatar)
  try {
    await resizeImage(
      path.join(process.cwd(), file.path),
      path.join(process.cwd(), 'public', 'uploads', path.basename(file.path)),
      config.user_image
    );
  } catch (e) {
    console.log('Не вышло оптимизоровать аватарку пользователя: ', e);
    fs.renameSync(path.join(process.cwd(), file.path), path.join(process.cwd(), 'public', 'uploads', path.basename(file.path)));
  }
  // end optimize

  const user = await User.findOne({ _id: id }).exec();
  if (user.image && fs.existsSync(path.join(process.cwd(), 'public', user.image))) {
    fs.unlinkSync(path.join(process.cwd(), 'public', user.image));
  }

  ctx.body = {
    // path: file.path.replace(/\\/g, '/').replace(/^public\//, '')
    path: ['uploads', path.basename(file.path)].join('/')
  };
});

module.exports = router;
