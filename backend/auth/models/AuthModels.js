const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

// Create User Model
let User = new Schema({
    email: {
        type: String,
        required: [true, 'You need to provide email.'],
        unique: [true, 'This email is already registered.'],
        validate: [isEmail, 'This email is invalid.']
    },
    password: {
        type: String,
        required: [true, 'You need to provide password.'],
        unique: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    todoLists: [
        {
            type: Schema.Types.ObjectId,
            ref: "todoLists"
        }
    ]
})

User.pre('save', function (next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

User.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    console.log(user)

    if (user) {
        const auth = bcrypt.compareSync(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}


const UserModel = mongoose.model("User", User);


// export models
module.exports.UserModel = UserModel;






