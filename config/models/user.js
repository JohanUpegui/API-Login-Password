const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const userSchema = new Schema({

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        unique: true,
        require: true
    }

});

//recibe la contraseña y la cifra

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//valida la contraseña y la acepta o devuelve un error

userSchema.methods.comparePassword = function (password) {
    bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);