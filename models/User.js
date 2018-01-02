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
  // updatedAt: Date, // { type: Date, default: Date.now }
  // createdAt: Date // { type: Date, default: Date.now }
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
