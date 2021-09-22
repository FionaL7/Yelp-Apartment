const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');
const User = require('./user');

const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_300')
})


const apartmentSchema = new Schema({
    title:  String,
    description: String,
    images : [ImageSchema],
    geometry:{
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        type: [Number],
        required: true
    }
    },
   price: Number,
    location: String,
    BHK: {
        type: String,
       enum : ['Studio', '1', '2', '3', 'Penthouse'],
    },
    amenities: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

})
// Delete reviews middleware
apartmentSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in : doc.reviews
            }
        })
    }
})

const Apartment = mongoose.model('Apartment', apartmentSchema)

module.exports = Apartment;

 