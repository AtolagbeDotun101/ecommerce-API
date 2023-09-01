const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'please input name']
    },
    email: {
        type: String,
        required: [true, 'please input emial'],
        validate: {
            validator: validator.isEmail,
            message:"please provide valid email"
        }
    },
    password: {
        type: String,
        required:[true, 'please input password'],
        minLength:6
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default:'User'
    }
})


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

// userSchema.methods.createJwt = function () {
//     return jwt.sign({userId:this._id, name:this.name, role:this.role}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
// }

module.exports = mongoose.model('User', userSchema)