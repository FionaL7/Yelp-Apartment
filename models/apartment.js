const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');
const User = require('./user')

const apartmentSchema = new Schema({
    title:  String,
    description: String,
    images : [
        {
            url: String,
            filename: String
        }
    ],
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

 