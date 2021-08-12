const commonController = require('../../Controllers/commonController.js');
const appconfig = require('../../../utils/appconfig.json');
const general = require('express').Router();
const baseUrl = appconfig.baseUrl

require('dotenv').config()

general.get('/test', async (req,res) => {
    res.render('test', { 
        rooturl: baseUrl 
    });
})

// object routes
general.get('/:objectname/list', async (req,res) => {
    var objectKey = commonController.getObjectKey(req.params.objectname)
    var objectTitle = commonController.getRealTitleName(req.params.objectname)
    var selectedModule = commonController.getSelectedModule(req.params.objectname)
    var params = {
        APP_NAME: process.env.APPLICATION_NAME,
        APP_COMPANY_NAME: process.env.COMPANY_NAME,
        objectName: req.params.objectname,
        objectKey: objectKey,
        objectTitle: objectTitle ? objectTitle : 'undefined',
        objectModule: 'setting',
        selectedModule: selectedModule
    }
    console.log(params)
    res.render('list-base', { 
        rooturl: baseUrl ,
        params: params
    });
})

general.get('/:objectname/create', async (req,res) => {
    var objectKey = commonController.getObjectKey(req.params.objectname)
    var selectedModule = commonController.getSelectedModule(req.params.objectname)
    var params = {
        APP_NAME: process.env.APPLICATION_NAME,
        APP_COMPANY_NAME: process.env.COMPANY_NAME,
        objectName: req.params.objectname,
        objectKey: objectKey,
        selectedModule: selectedModule,
        relatedData: [],
    }
   
    res.render('setting-base', { 
        rooturl: baseUrl ,
        params: params,
        rowData : null
    });
})

general.get('/:objectname/:objectid/edit', async (req,res) => {
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
        APP_NAME: process.env.APPLICATION_NAME,
        APP_COMPANY_NAME: process.env.COMPANY_NAME,
        objectName: req.params.objectname,
        objectKey: objectKey,
        selectedModule: selectedModule,
        rowData: rowData.data[0],
        relatedData: relatedData
    }
    
    res.render('setting-base', { 
        rooturl: baseUrl,
        params: params
    });
})

general.get('/:objectname', async (req,res) => {
    let objectName = req.params.objectname
    res.render(`${objectName}`, { 
        rooturl: baseUrl 
    });
})

module.exports = general