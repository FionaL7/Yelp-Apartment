const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, place, bhk, amenities} = require('./helpers');
const Apartment = require('../models/apartment');


mongoose.connect('mongodb://localhost:27017/yelp-apartments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const generator = async () => {
    await Apartment.deleteMany({});
    for(i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const aptPrice = Math.floor(Math.random() * 900)+ 6;
    
        const apt = new Apartment({
            author: '6138fd05a5defc3223f1ded1',
            price: aptPrice,
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(place)}`,
        images : [ 
            {
                 url : "https://res.cloudinary.com/dos5fvc4r/image/upload/v1631820945/Yelp-apartment/ocmkakt0syxgktpejy25.jpg", 
                 filename : "Yelp-apartment/ocmkakt0syxgktpejy25"
                }
            ],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac tortor vitae purus faucibus ornare suspendisse.",
        BHK: `${sample(bhk)}`,
        amenities: `${sample(amenities)}`
        })
        await apt.save();
    }
}

generator().then(() =>{
    mongoose.connection.close()
});

