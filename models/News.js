const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  // _id: monsoose.Schema.Types.ObjectId, // monsoose.SchemaTypes.ObjectId
  __v: { type: Number, select: false },
  theme: { type: String, required: true },
  text: { type: String, required: true },
  date: Date,
  // userId: Number
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  // updatedAt: Date,
  // createdAt: Date
}, {
  timestamps: true
});

NewsSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('News', NewsSchema);

/* Example json:
[
  {
    "id": 1,
    "text": "Тестовая новость\nС тестовых полей\nПора уже выкатывать\nДавай-ка кодь быстрей!!!",
    "theme": "Тест",
    "date": "2017-12-04T21:34:06.000Z",
    "createdAt": "2017-12-04T21:34:44.478Z",
    "updatedAt": "2017-12-04T22:10:06.423Z",
    "userId": 1,
    "user": {
      "id": 1,
      "firstName": "Syrstov",
      "middleName": "Alexeyevitch",
      "surName": "Александр",
      "username": "headadmin",
      "password": "$2a$10$f1773FpxZm1iuF2ucFBiKeEI9Lutg4P9JCEr2WOgUrZ7CSnqn89/u",
      "access_token": "94ea8823-8ecc-4c61-b00e-4dee8a7abd3c",
      "image": "undefined/undefined",
      "__id": "94c1cb5f-9e63-4bea-a41e-32661a85dff5",
      "createdAt": "2017-12-04T21:32:42.292Z",
      "updatedAt": "2017-12-25T20:17:32.221Z",
      "permissionId": 1
    }
  },
  {
    "id": 2,
    "text": "Последние тестики, вроде все ок.",
    "theme": "Тесты-тесты",
    "date": "2017-12-07T22:33:14.000Z",
    "createdAt": "2017-12-07T22:33:47.431Z",
    "updatedAt": "2017-12-07T22:33:47.431Z",
    "userId": 1,
    "user": {
      "id": 1,
      "firstName": "Syrstov",
      "middleName": "Alexeyevitch",
      "surName": "Александр",
      "username": "headadmin",
      "password": "$2a$10$f1773FpxZm1iuF2ucFBiKeEI9Lutg4P9JCEr2WOgUrZ7CSnqn89/u",
      "access_token": "94ea8823-8ecc-4c61-b00e-4dee8a7abd3c",
      "image": "undefined/undefined",
      "__id": "94c1cb5f-9e63-4bea-a41e-32661a85dff5",
      "createdAt": "2017-12-04T21:32:42.292Z",
      "updatedAt": "2017-12-25T20:17:32.221Z",
      "permissionId": 1
    }
  }
]
*/
