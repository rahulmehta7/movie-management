const Joi = require('joi');

const movieValidation = (data) => {
    const movieSchema = Joi.object( {
        movieName : Joi.string().min(2).max(80).required(), 
        movieRating : Joi.number().min(0).max(5).required(), 
        movieYear : Joi.number().required(), 
    })    
    return movieSchema.validate(data);
}

module.exports.movieValidation = movieValidation