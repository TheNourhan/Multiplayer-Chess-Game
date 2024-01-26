const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    unsername: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    connection_statuse: {type: String, required: true}
});
var User = mongoose.model('User', UserSchema);
module.exports = User;