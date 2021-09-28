const Apartment = require('./models/apartment');
const {apartmentSchema, reviewSchema} = require('./schema.js');
const expressError = require('./utils/ExpressError');
const Review = require('./models/review');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
       req.session.returnTo =  req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login')
    }
    next()
}

module.exports.validateApartment = (req, res, next) =>{
const {error} = apartmentSchema.validate(req.body);
if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg, 400)
} else {
    next()
}

}

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const apartment = await Apartment.findById(id);
    if(!apartment.author.equals(req.user._id)){
    req.flash('error', 'You are not authorised');
    return res.redirect(`/apartments/${apartment._id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not authorised');
        return res.redirect(`/apartments/${apartment._id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)
    } else {
        next()
    }
}