const router = require('express').Router()
const movieHandle = require('./models/movieSchema')
const random = require('random-string-generator');
const { movieValidation } = require('./validation')

router.post('/add' , async (req , res) => {
    try {

        // Validation
        const { error } = movieValidation(req.body);
        if (error){
            return res.status(400).json({ message : error.details[0].message });
        }   

        const movieInfo = {
            movieId: random(3, 'numeric'),
            movieName: req.body.movieName,
            movieRating: req.body.movieRating,
            movieYear : req.body.movieYear
        }

        const movie = new movieHandle( movieInfo )
        const response = await movie.save();
        res.json(response)
    }
    catch (ex){
        res.status(500).send(ex);
    }
})


router.get('/getallmovies' , async (req , res) => {
    try {
        const response = await movieHandle.find();
        res.json(response)
    }
    catch (ex){
        res.status(500).send(ex);
    }   
})

router.get('/rating/:movieRating' , async (req , res)=>{
    try {
        const response = await movieHandle.find({ movieRating :req.params.movieRating });
        if(response?.length > 0) {
            res.json(response)
        }
        else {
            res.status(404).json({ message : "Movies not exist" })
        }           
    }
    catch (ex){
        res.status(500).send(ex);
    }   
})

router.get('/year/:movieYear' , async (req , res)=>{
    try {
        const response = await movieHandle.find({ movieYear :req.params.movieYear });
        if(response?.length > 0) {
            res.json(response)
        }
        else {
            res.status(404).json({ message : "Movies not exist" })
        }           
    }
    catch (ex){
        res.status(500).send(ex);
    }   
})

router.post('/update' , async (req , res)=>{
    try {
        // Validation
        let movie = await movieHandle.findOne({ movieId: req.body.movieId });
        if (!movie) {
            return res.status(404).json({ message : "movie not exist" });
        }

        filter = { movieId : movie.movieId }
        const response = await movieHandle.updateOne(filter, { $set : req.body });
        res.json(response)
    }
    catch (ex){
        res.status(500).send(ex);
    } 
})

module.exports  = router