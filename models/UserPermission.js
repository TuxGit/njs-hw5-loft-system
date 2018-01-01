const mongoose = require('mongoose');

const UserPermissionSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  __v: { type: Number, select: false },
  chat: {
    C: Boolean,
    D: Boolean,
    R: Boolean,
    U: Boolean
  },
  news: {
    C: Boolean,
    D: Boolean,
    R: Boolean,
    U: Boolean
  },
  setting: {
    C: Boolean,
    D: Boolean,
    R: Boolean,
    U: Boolean
  }
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

UserPermissionSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('UserPermission', UserPermissionSchema, 'user_permissions');
