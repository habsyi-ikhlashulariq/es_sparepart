const commonController = require('../../Controllers/commonController.js');
const route = require('express').Router();

route.get('/test', async (req,res) => {
    let result = await commonController.testRead()
    res.json(result)
})

// Retrieve record routes
route.get('/:objectname', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectKey : '',
        objectId : '',
        dataTable: false
    }
    let result = await commonController.getObjectData(params)
    res.send(result)
})

route.get('/:objectname/:objectid', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectId : req.params.objectid,
        dataTable: false
    }
    let result = await commonController.getObjectData(params)
    res.send(result)
})

// datatable server side
route.get('/:objectname/0/datatable', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectKey : '',
        objectId : '',
        dataTable: true,
        draw: parseInt(req.query.draw),
        start: parseInt(req.query.start),
        length: parseInt(req.query.length),
        searchValue: req.query.search.value
    }
    let result = await commonController.getObjectDataTable(params)
    res.send(result)
})

// select option server side
route.get('/:objectname/0/option', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectKey : req.query.search ?  req.query.search :'',
        objectId : '',
    }
    let result = await commonController.getObjectForSelectOption(params)
    res.send(result)
})

// select option server side
route.get('/:objectname/0/autocomplete', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectKey : req.query.query,
        objectId : '',
    }
    let result = await commonController.getObjectForAutoComplete(params)
    res.send(result)
})

// custom select option server side
route.get('/:objectname/0/autocomplete/custom', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectKey : req.query.query,
        objectId : '',
        customKey : req.query.ckey
    }
    let result = await commonController.getObjectForAutoCompleteCustom(params)
    res.send(result)
})

// get record
route.get('/:objectname/0/get', async (req,res) => {
    let params = {
        objectName : req.params.objectname,
        objectSQlNode : req.query.node,
        objectKey : null,        
        objectId : req.query.id,
    }
    let result = await commonController.getDynamicObjectData(params)
    res.send(result)
})

// Insert records route
route.post('/:objectname', async (req, res) => {
    console.log('body:', req.body)
    let params = {
        objectName : req.params.objectname,
        objectValue : req.body.dt_objectTable
    }

    let result = await commonController.insertObjectData(params)
    res.send(result)
})

// Update records route
route.put('/:objectname', async (req, res) => {
    let params = {
        objectName : req.params.objectname,
        objectValue : req.body.dt_objectTable
    }

    let result = await commonController.updateObjectData(params)
    res.send(result)
})

// Delete records route
route.delete('/:objectname', async (req, res) => {
    let params = {
        objectName : req.params.objectname,
        objectValue : req.body.dt_objectTable
    }
    let result = await commonController.deleteObjectData(params)
    res.send(result)
})

route.delete('/:objectname/:objectid', async (req, res) => {
    let params = {
        objectName : req.params.objectname,
        objectId : req.params.objectid
    }
    let result = await commonController.deleteObjectDataDirect(params)
    res.send(result)
})

module.exports = route
