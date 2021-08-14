var router = require('express').Router()
var public = require('./public/index')


router.use('/public',public)
router.use(function (req, res, next) {
    res.status(404).send({
        success: false,
        error: true,
        errorMessage: 'uknown API end point'
    })
})

module.exports = public
module.exports = router