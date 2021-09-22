const Apartment = require('../models/apartment');
const User = require('../models/user');
const BHK = ['Studio', '1', '2', '3', 'Penthouse'];
const { cloudinary } = require('../Cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async(req, res) =>{
    const apartments = await Apartment.find({});
 res.render('apartments/index',{apartments})
    }

module.exports.renderCreateForm = (req, res) =>{
    res.render('apartments/new', {BHK})
}

module.exports.createApt = async(req, res, next) =>{
const geoData = await geocoder.forwardGeocode({
    query: req.body.apartment.location,
    limit: 1,
    autocomplete: true
}).send()

    const {id} = req.params;
    const apartment = await new Apartment(req.body.apartment);
  apartment.geometry = geoData.body.features[0].geometry;
    apartment.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    apartment.author = req.user._id;
     await apartment.save();
    req.flash('success', 'Created successfully!')
    console.log(apartment)
    res.redirect(`/apartments/${apartment._id}`)
    
}

module.exports.showPage = async(req, res) =>{
    try{
        const {id} = req.params;
        const apartment = await Apartment.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
     
        if(!apartment){
            req.flash('error', 'Page not found')
            return res.redirect('/apartments')
            }
        res.render('apartments/details', {apartment});
    } catch {
     throw new Error(404, 'Something went wrong')
    }
  
}

module.exports.renderEditForm = async(req, res) =>{
    const {id} = req.params;
    const apartment = await Apartment.findById(id)
    if(!apartment){
        req.flash('error', 'Page not found');
        return res.redirect('/apartments')
    }
    res.render('apartments/edit', {apartment})
}

module.exports.editApt = async(req, res) =>{
    const {id} = req.params;
    console.log(req.body)
    const apartment = await Apartment.findByIdAndUpdate(id, {  ...req.body.apartment}, {runValidators: true, new: true});
   const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
   apartment.images.push(...imgs)
  if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
          await cloudinary.uploader.destroy(filename);
      }
      // pull images of filename if it is in deleteImages
      await apartment.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
    await apartment.save();
    req.flash('success', 'Edited successfully')
    res.redirect(`/apartments/${apartment._id}`)
   
}

module.exports.deleteApt = async(req, res) =>{
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted successfully')
    res.redirect('/apartments')
    }