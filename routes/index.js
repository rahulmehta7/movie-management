const router = require('express').Router()

router.use("/v1/movie", require('./v1/movies'));

module.exports = router;