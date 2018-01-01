const mongoose = require('mongoose');

// const userSchema = monsoose.Schema({
const UserSchema = new mongoose.Schema({
  // _id: monsoose.Schema.Types.ObjectId, // monsoose.SchemaTypes.ObjectId
  __v: { type: Number, select: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  surName: String,
  middleName: String,
  image: String,
  permissionId: String,
  // permission: Object,
  access_token: String
  // updatedAt: Date,
  // createdAt: Date
}, {
  timestamps: true
});

UserSchema.virtual('permission', {
  ref: 'UserPermission', // The model to use
  localField: 'permissionId', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true
});

UserSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', UserSchema);

/* Example json:
{
  "__id": "a6c7fb5f-4903-44e7-8e8a-1d156da5578b",
  "id": 4,
  "username": "test",
  "password": "$2a$10$JQLI8Lr6o3ou2I1C.Nljge9JkozFSuWJdYkM3/tKztg0TiRQggrxi",
  "firstName": "test",
  "surName": "test",
  "middleName": "test",
  "permission": {
    "__id": "5a6a6a8c-7389-40b7-ac84-ce1e1c308e54",
    "id": 4,
    "chat": {
      "__id": "78db8708-4ba0-4d9e-b77e-7509e42f0350",
      "id": 4,
      "C": false,
      "R": true,
      "U": true,
      "D": false,
      "updatedAt": "2017-12-26T13:21:11.873Z",
      "createdAt": "2017-12-26T13:21:11.873Z"
    },
    "news": {
      "__id": "396e4ef8-56b4-49ff-aede-bf2e11954322",
      "id": 4,
      "C": false,
      "R": true,
      "U": false,
      "D": false,
      "updatedAt": "2017-12-26T13:21:11.875Z",
      "createdAt": "2017-12-26T13:21:11.875Z"
    },
    "setting": {
      "__id": "e4c9842c-048b-4434-9fe7-93b8258e088a",
      "id": 4,
      "C": false,
      "R": false,
      "U": false,
      "D": false,
      "updatedAt": "2017-12-26T13:21:11.876Z",
      "createdAt": "2017-12-26T13:21:11.876Z"
    },
    "updatedAt": "2017-12-26T13:21:11.872Z",
    "createdAt": "2017-12-26T13:21:11.872Z",
    "chatId": 4,
    "newsId": 4,
    "settingId": 4
  },
  "access_token": "4750e7af-5f47-4153-99ef-4cbe7dd03852",
  "updatedAt": "2017-12-26T13:21:11.867Z",
  "createdAt": "2017-12-26T13:21:11.867Z",
  "permissionId": 4,
  "image": null
}
*/
