var router = require('express').Router()
var general = require('./general')
var esPublicV1 = require('./v1/index')

router.use('/general',general)
router.use('/sparepart',general)
router.use('/v1',esPublicV1)

router.use(function (req, res, next) {
    res.status(404).send({
        success: false,
        error: true,
        errorMessage: 'uknown API end point'
    })
})

module.exports = general
module.exports = router
// module.exports = esPublicV1