const mongoose = require('mongoose')
const movieSchema = mongoose.Schema({
    movieId : {
        type : String,
        required: true,
        min: 3,
        max: 3        
    },
    movieName : {
        type : String,
        required: true,        
        min: 2,
        max: 80
    }, 
    movieRating : {
        type : Number,
        required: true,        
        min: 0,
        max: 5
    }, 
    movieYear : {
        type : Number,
        required: true,    
    }            
})
module.exports =  mongoose.model( 'moviedb' , movieSchema)