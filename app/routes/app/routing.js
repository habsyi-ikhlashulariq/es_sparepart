const commonController = require('../.././Controllers/commonController.js');
const routing = require('express').Router();

routing.get('/test', async (req,res) => {
    res.render('test', { 
        rooturl: 'http://localhost:8080/' 
    });
})

// object routes
routing.get('/:objectname/list', async (req,res) => {
    var objectKey = commonController.getObjectKey(req.params.objectname)
    var objectTitle = commonController.getRealTitleName(req.params.objectname)
    var selectedModule = commonController.getSelectedModule(req.params.objectname)
    var params = {
        APP_NAME: 'greenSys',
        APP_COMPANY_NAME: 'greenSolutions',
        objectName: req.params.objectname,
        objectKey: objectKey,
        objectTitle: objectTitle ? objectTitle : 'undefined',
        objectModule: 'common',
        selectedModule: selectedModule
    }
    console.log(params)
    res.render('list-base', { 
        rooturl: 'http://localhost:8080/' ,
        params: params
    });
})

routing.get('/:objectname/create', async (req,res) => {
    var objectKey = commonController.getObjectKey(req.params.objectname)
    var selectedModule = commonController.getSelectedModule(req.params.objectname)
    var params = {
        APP_NAME: 'greenSys',
        APP_COMPANY_NAME: 'greenSolutions',
        objectName: req.params.objectname,
        objectKey: objectKey,
        selectedModule: selectedModule,
        relatedData: [],
    }
   
    res.render('common-base', { 
        rooturl: 'http://localhost:8080/' ,
        params: params,
        rowData : null
    });
})

routing.get('/:objectname/:objectid/edit', async (req,res) => {
    let objectKey = commonController.getObjectKey(req.params.objectname)
    var selectedModule = commonController.getSelectedModule(req.params.objectname)
    var params = {
        objectName : req.params.objectname,
        objectId : req.params.objectid,
        dataTable: false
    }

    let rowData = await commonController.getObjectData(params)
    let relatedData = await commonController.getRelatedObjectData(params)
    console.log(JSON.stringify(relatedData))
    params = {
        APP_NAME: 'greenSys',
        APP_COMPANY_NAME: 'greenSolutions',
        objectName: req.params.objectname,
        objectKey: objectKey,
        selectedModule: selectedModule,
        rowData: rowData.data[0],
        relatedData: relatedData
    }
    
    res.render('common-base', { 
        rooturl: 'http://localhost:8080/' ,
        params: params
    });
})

routing.get('/:objectname', async (req,res) => {
    let objectName = req.params.objectname
    res.render(`${objectName}`, { 
        rooturl: 'http://localhost:8080/' 
    });
})

module.exports = routing