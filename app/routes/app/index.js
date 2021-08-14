const router = require('express').Router()
const sparepart = require('./sparepart')
const appconfig = require('../../../utils/appconfig.json')
const baseUrl = appconfig.baseUrl

require('dotenv').config()

router.use('/sparepart',sparepart)
router.use('/', async (req,res) => {
    res.render('index', { 
        rooturl: baseUrl,
        params: {
            APP_NAME: process.env.APPLICATION_NAME,
            APP_COMPANY_NAME: process.env.APP_COMPANY_NAME,
            objectName: 'homepage',
            objectKey: '',
            selectedModule: '',
            rowData: null,
            relatedData: null
        }
    });
})


router.use(function (req, res, next) {
    res.status(404).render("index",  
    {
        rooturl: baseUrl,
        params: {
            APP_NAME: process.env.APPLICATION_NAME,
            APP_COMPANY_NAME: process.env.APP_COMPANY_NAME,
            objectName: '404',
            objectKey: '',
            selectedModule: '',
            rowData: null,
            relatedData: null
        }
    })
})


module.exports = sparepart
module.exports = router