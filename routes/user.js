const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const flash = require('connect-flash');
const catchAsync = require('../utils/catchAsync');
const Apartment = require('../models/apartment');
const userControls = require('../Controllers/userControl')

router.get('/register', userControls.registerForm)

router.post('/register', catchAsync(userControls.registerUser))

router.get('/login', userControls.loginForm)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userControls.loginUser)

router.get('/logout', userControls.logout)

module.exports = router;