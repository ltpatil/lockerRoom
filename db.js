const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
    username: {
        type : String,
        unique : true
    },
    password: String,
    info: String
});

const UserModel = mongoose.model('users', user);

module.exports = UserModel;