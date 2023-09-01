const { register, login, logout } = require('../controllr/authController')
const express = require('express')
const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)


module.exports = router