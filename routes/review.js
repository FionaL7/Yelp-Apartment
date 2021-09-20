const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Apartment = require('../models/apartment');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const revControls = require('../Controllers/reviewControl')

router.post('/', isLoggedIn, validateReview, catchAsync(revControls.createForm))

router.delete('/:reviewId', isReviewAuthor, catchAsync(revControls.deleteReview))



module.exports = router