const Apartment = require('../models/apartment');
const User = require('../models/user');
const BHK = ['Studio', '1', '2', '3', 'Penthouse'];

module.exports.index = async(req, res) =>{
    const apartments = await Apartment.find({});
 res.render('apartments/index',{ apartments})
    }

module.exports.renderCreateForm = (req, res) =>{
    res.render('apartments/new', {BHK})
}

module.exports.createApt = async(req, res) =>{
    const {id} = req.params;
    const apartment = await new Apartment(req.body.apartment);
    apartment.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    apartment.author = req.user._id;
     await apartment.save();
    req.flash('success', 'Created successfully!')
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
    const apartment = await Apartment.findByIdAndUpdate(id, {  ...req.body.apartment}, {runValidators: true, new: true});
   const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
   apartment.images.push(...imgs)
    await apartment.save();
    req.flash('success', 'Edited successfully')
    res.redirect(`/apartments/${id}`)
   
}

module.exports.deleteApt = async(req, res) =>{
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted successfully')
    res.redirect('/apartments')
    }