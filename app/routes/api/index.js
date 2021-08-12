var router = require('express').Router()
var general = require('./general')
var transaction = require('./transaction')

router.use('/general',general)
router.use('/sparepart',general)
router.use('/transaction',transaction)
router.use('/setting',general)

router.use(function (req, res, next) {
    res.status(404).send({
        success: false,
        error: true,
        errorMessage: 'uknown API end point'
    })
})

module.exports = general
module.exports = transaction
module.exports = router