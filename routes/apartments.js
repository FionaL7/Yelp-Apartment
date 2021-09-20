const express = require('express')
const router = express.Router();
const Apartment = require('../models/apartment');
const {apartmentSchema} = require('../schema.js');
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review');
const {validateApartment,isLoggedIn, isAuthor} = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const controls = require('../Controllers/aptControl');
const {storage} = require('../Cloudinary')                     // dont need to require index.js because node automatically looks for index.js
const multer = require('multer');
const upload = multer({ storage });


router.route('/')
.get( controls.index)
.post(isLoggedIn, upload.array('image'), validateApartment,  catchAsync( controls.createApt));

router.get('/new',isLoggedIn,  controls.renderCreateForm);

router.route('/:id')
.get(catchAsync(controls.showPage ))
.put( isAuthor, isLoggedIn, upload.array('image'), catchAsync(controls.editApt ))
.delete(isAuthor ,isLoggedIn, controls.deleteApt)

router.get('/:id/edit',isAuthor,  isLoggedIn, catchAsync (controls.renderEditForm))

module.exports = router;

