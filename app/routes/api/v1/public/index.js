const commonController = require('../../../../Controllers/commonController.js');
const publicController = require('../../../../Controllers/publicController.js');
const route = require('express').Router();


route.get('/ping', async (req,res) => {
    res.send("pong")
})

route.get('/test', async (req,res) => {
    let result = await publicController.createTransaction(
                    {
                        transNumber : "12345678", 
                        transDate   : "2021-08-11",
                        customerId : 1,
                        customerName: "Jojon Gundala",
                        lines: [
                            {
                                partNumber: "082322MAK0LN1",
                                qty: 10,
                                priceSale: 5000
                            }
                        ]
                 })
    res.json(result)
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

// insert transaction
route.post('/sales', async (req, res) => {
    console.log('body:', req.body)
    let result = await publicController.createTransaction(req.body)
    res.send(result)
})

// Update transaction
route.put('/sales', async (req, res) => {
    console.log('body:', req.body)
    let result = await publicController.updateTransaction(req.body)
    res.send(result)
})

// delete transaction
route.delete('/sales', async (req, res) => {
    console.log('body:', req.body)
    let result = await publicController.deleteTransaction(req.body)
    res.send(result)
})

// delete transaction line
route.delete('/sales/line', async (req, res) => {
    console.log('body:', req.body)
    let result = await publicController.deleteTransactionLine(req.body)
    res.send(result)
})

module.exports = route