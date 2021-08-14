const commonController = require('../../../../Controllers/commonController.js');
const publicController = require('../../../../Controllers/publicController.js');
const route = require('express').Router();


route.get('/ping', async (req,res) => {
    res.json({
        success: true,
        error: null,
        message: publicController.sanitizeBody({
            objectBody:{
                transNumber : "12345678", 
                transDate   : "2021-08-11",
                lines: [
                    {
                        partNumber: "082322MAK0LN1",
                        qty: 10,
                        priceSale: 5000
                    }
                ]
            }
        })
    })
})

route.get('/spareparts', async (req,res) => {
    let params = {
        objectName : 'api-spareparts',
        objectKey : '',
        objectId : '',
        dataTable: false
    }
    let result = await commonController.getObjectData(params)
    res.send(result)
})

route.get('/sparepart/:objectid', async (req,res) => {
    let params = {
        objectName : 'api-sparepart',
        objectId : req.params.objectid,
        dataTable: false
    }
    let result = await commonController.getObjectData(params)
    res.send(result)
})

route.post('/sales', async (req, res) => {
    console.log('body:', req.body)
    let params = {
        objectName : 'sales',
        objectBody : req.body
    }

    let result = await commonController.insertObjectData(params)
    res.send(result)
})

module.exports = route