const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    default: '' 
  },
  isOnline: {
    type: Boolean,
    default: false
  }
})

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
  },
  authLevel: {
    type: String,
    required: true,
    default: 'normal',
  },
  hospitalInfo: infoSchema
});

module.exports = mongoose.model('User', UserSchema);
