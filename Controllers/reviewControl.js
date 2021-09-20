const Review = require('../models/review');
const Apartment = require('../models/apartment')

module.exports.createForm = async(req, res) =>{
    const {id} = req.params;
    const apartment = await Apartment.findById(id);
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    apartment.reviews.push(review);
    await apartment.save();
    await review.save();
    req.flash('success', 'Review created successfully')
    res.redirect(`/apartments/${apartment._id}`)
    }

module.exports.deleteReview = async(req, res) =>{
    const {id, reviewId} = req.params;
   const apartment = await Apartment.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId );
    req.flash('success', 'Review deleted')
    res.redirect(`/apartments/${apartment._id}`)
}