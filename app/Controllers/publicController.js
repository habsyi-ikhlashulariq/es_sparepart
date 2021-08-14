const model = require('.././Models/commonModel.js');
const commonController = require('./commonController.js')
const sqlcollection = require('../.././utils/sqlcollection.json');

class PublicController
{
    constructor(){
        
    }

    async createTransaction(params) {
        if ( this.sanitizeBody (params) ) {
            console.log(params)
                
            let isExist = await this.isExistingTransaction(params.transNumber)
            if (!isExist) {
                let insertedHeader = await this.createTransactionHeader(params)
                if (insertedHeader.success){
                    let newTransactionId = insertedHeader.data
                    let insertedLines = await this.createTransactionLines(params.lines, newTransactionId)
                    console.log(insertedLines)
                    if (insertedLines.success ){

                        return this.sendMessage({
                            status: true,
                            message: 'data uploaded successfully',
                            data: []
                        })
                    }else{
                        return this.sendMessage({
                            status: false,
                            message: 'failed when inserting line data',
                            data: []
                        })
                    }
                }else{
                    return this.sendMessage({
                        status: false,
                        message: 'failed when creating trasaction',
                        data: []
                    })
                }
            }else{
                return this.sendMessage({
                    status: false,
                    message: `${params.transNumber} is already exist on the database`,
                    data: []
                })
            }
        }else{
            return this.sendMessage({
                status: false,
                message: `please check for any wrong data submitted`,
                data: []
            })
        }
    }

    async updateTransaction(params) {
        if ( this.sanitizeBody (params) ) {
            console.log(params)
                
            let isExist = await this.isExistingTransaction(params.transNumber)
            if (isExist) {
                let updatedHeader = await this.updateTransactionHeader(params)
                if (updatedHeader.success){
                    let result = updatedHeader.data

                    let transId = await this.getTransactionId(params.transNumber)
                    let updatedLines = await this.createTransactionLines(params.lines, transId)
                    console.log(updatedLines)
                    if (updatedLines.success ){

                        return this.sendMessage({
                            status: true,
                            message: 'data updated successfully',
                            data: []
                        })
                    }else{
                        return this.sendMessage({
                            status: false,
                            message: 'failed when updating line data',
                            data: []
                        })
                    }
                }else{
                    return this.sendMessage({
                        status: false,
                        message: 'failed when updating trasaction',
                        data: []
                    })
                }
            }else{
                return this.sendMessage({
                    status: false,
                    message: `${params.transNumber} is not exist on the database`,
                    data: []
                })
            }
        }else{
            return this.sendMessage({
                status: false,
                message: `please check for any wrong data submitted`,
                data: []
            })
        }
    }

    async deleteTransaction(params) {
        if ( this.sanitizeBodyForDeleteRequest (params) ) {
            console.log(params)
                
            let isExist = await this.isExistingTransaction(params.transNumber)
            if (isExist) {
                let resp = await this.executeDeleteTransaction(params)
                if (resp.success){
                    return this.sendMessage({
                        status: true,
                        message: 'data deleted successfully',
                        data: []
                    })
                }else{
                    return this.sendMessage({
                        status: false,
                        message: 'failed when deleting trasaction',
                        data: []
                    })
                }
            }else{
                return this.sendMessage({
                    status: false,
                    message: `${params.transNumber} is not exist on the database`,
                    data: []
                })
            }
        }else{
            return this.sendMessage({
                status: false,
                message: `please check for any wrong data submitted`,
                data: []
            })
        }
    }

    async deleteTransactionLine(params) {
        if ( this.sanitizeBodyForDeleteLineRequest (params) ) {
            console.log(params)
                
            let isExist = await this.isExistingTransaction(params.transNumber)
            if (isExist) {
                let resp = await this.executeDeleteTransactionLine(params)
                if (resp.success){
                    return this.sendMessage({
                        status: true,
                        message: 'data deleted successfully',
                        data: []
                    })
                }else{
                    return this.sendMessage({
                        status: false,
                        message: 'failed when deleting trasaction',
                        data: []
                    })
                }
            }else{
                return this.sendMessage({
                    status: false,
                    message: `${params.transNumber} is not exist on the database`,
                    data: []
                })
            }
        }else{
            return this.sendMessage({
                status: false,
                message: `please check for any wrong data submitted`,
                data: []
            })
        }
    }

    async createTransactionHeader(params) {
        let headerData = await this.createTransactionHeaderQuery(params)
        let headerQuery = commonController.queryGenerator('INS', headerData)
        let result = await model.insertData(headerQuery)
        return result
    }

    async updateTransactionHeader(params) {
        let headerData = await this.createTransactionHeaderQuery(params)
        let headerQuery = commonController.queryGenerator('UPD', headerData)
        console.log('headerQuery', headerQuery)
        let result = await model.updateData(headerQuery)
        return result
    }

    async executeDeleteTransaction(params){
        let deletedLine = await this.createTransactionLineDeleteQuery(params)
        let deleteLineQuery = commonController.queryGenerator('DEL', deletedLine)
        console.log(deleteLineQuery)
        let result = await model.directExecute(deleteLineQuery)

        let deletedHeader = await this.createTransactionDeleteQuery(params)
        let deleteHeaderQuery = commonController.queryGenerator('DEL', deletedHeader)
        console.log(deleteHeaderQuery)
        result = await model.directExecute(deleteHeaderQuery)
        return result
    }

    async executeDeleteTransactionLine(params){
        let deletedLine = await this.createSingleTransactionLineDeleteQuery(params)
        let deleteLineQuery = commonController.queryGenerator('DEL', deletedLine)
        console.log(deleteLineQuery)
        let result = await model.directExecute(deleteLineQuery)
        return result
    }

    async createTransactionHeaderQuery(params) {
        
        let newTransaction = {
            objectName : 'distribution-goods',
            objectValue : [{
                dt_fieldsCollection:[{
                    fieldName: "trans_number",
                    fieldValue: params.transNumber,
                    fieldType: "string",
                    fieldKey: "0"
                },{
                    fieldName: "trans_date",
                    fieldValue: params.transDate,
                    fieldType: "string",
                    fieldKey: "0"
                },{
                    fieldName: "customer_id",
                    fieldValue: params.customerId,
                    fieldType: "numeric",
                    fieldKey: "0"
                },{
                    fieldName: "customer_name",
                    fieldValue: params.customerName,
                    fieldType: "string",
                    fieldKey: "0"
                }],
                dt_relatedTables:[],
                tableName:"distribution-goods",
                autonumFormat:"",
                modify_status:"INS"
            }]
        }

        let transId = await this.getTransactionId(params.transNumber)
        if (transId != '') {
            newTransaction.objectValue[0].dt_fieldsCollection.push({
                fieldName: "autonumber",
                fieldValue: transId,
                fieldType: "numeric",
                fieldKey: "1"
            })
            newTransaction.objectValue[0].modify_status = "UPD"
        }

        return newTransaction
    }


    async createTransactionLines(lines, newTransactionId) {
        let insertedLine = {
            success: false,
            error: null,
            data: null
        }

        let lineQuery = ""
        for (let i = 0; i < lines.length; i++) {
            const item = lines[i];
            let lineData = await this.createTransactionLineQuery(item, newTransactionId)
            console.log(lineData)
            lineQuery += commonController.queryGenerator('INS', lineData)
        }

        if (lineQuery != "")
        {
            console.log(lineQuery)
            insertedLine= await model.directExecute(lineQuery)
        }else{
            insertedLine.error = "empty query"
        }

        return insertedLine
    }

    async createTransactionLineQuery(params, transactionId){

        let partId = await this.getItemId(params.partNumber)
        console.log('getItemId', params.partNumber,partId,transactionId)

        let newTransactionLines = {
            objectName : 'stock-details',
            objectValue : [{
                dt_fieldsCollection:[{
                    fieldName: "trans_source",
                    fieldValue: "SALES",
                    fieldType: "string",
                    fieldKey: "0",
                    flag: ""
                },{
                    fieldName: "part_id",
                    fieldValue: partId,
                    fieldType: "numeric",
                    fieldKey: "0",
                    flag: ""
                },{
                    fieldName: "qty_in",
                    fieldValue: "0",
                    fieldType:"numeric",
                    fieldKey:"0",
                    flag:""
                },{
                    fieldName: "qty_out",
                    fieldValue: params.qty,
                    fieldType:  "numeric",
                    fieldKey:"0",
                    flag: ""
                }],
                dt_relatedTables:[],
                tableName:  "stock_detail",
                autonumFormat:  "",
                modify_status:  "INS"
            }]
        }

        let lineId = await this.getTransactionLineId(transactionId, partId)
        if (lineId != '') {
            newTransactionLines.objectValue[0].dt_fieldsCollection.push({
                fieldName: "autonumber",
                fieldValue: lineId,
                fieldType: "numeric",
                fieldKey: "1"
            })
            newTransactionLines.objectValue[0].modify_status = "UPD"
        }else{
            newTransactionLines.objectValue[0].dt_fieldsCollection.push({
                fieldName: "trans_id",
                fieldValue: transactionId,
                fieldType: "numeric",
                fieldKey: "0",
                flag: ""
            })
        }
        return newTransactionLines
    }

    async createTransactionDeleteQuery(params) {
        
        let newTransaction = {
            objectName : 'distribution-goods',
            objectValue : [{
                dt_fieldsCollection:[{
                    fieldName: "trans_number",
                    fieldValue: params.transNumber,
                    fieldType: "numeric",
                    fieldKey: "1"
                }],
                dt_relatedTables:[],
                tableName:"distribution-goods",
                autonumFormat:"",
                modify_status:"DEL"
            }]
        }

        
        return newTransaction
    }

    async createTransactionLineDeleteQuery(params) {
        
        let transId = await this.getTransactionId(params.transNumber)
       
        let newTransaction = {
            objectName : 'stock-detail',
            objectValue : [{
                dt_fieldsCollection:[{
                    fieldName: "trans_id",
                    fieldValue: transId,
                    fieldType: "numeric",
                    fieldKey: "1"
                },{
                    fieldName: "trans_source",
                    fieldValue: 'SALES',
                    fieldType: "string",
                    fieldKey: "1"
                }],
                dt_relatedTables:[],
                tableName:"stock-detail",
                autonumFormat:"",
                modify_status:"DEL"
            }]
        }

        return newTransaction
    }

    async createSingleTransactionLineDeleteQuery(params) {
        
        let transId = await this.getTransactionId(params.transNumber)
        let partId = await this.getItemId(params.partNumber)
        console.log('createSingleTransactionLineDeleteQuery', params,transId, partId)
       
        let newTransaction = {
            objectName : 'stock-detail',
            objectValue : [{
                dt_fieldsCollection:[{
                    fieldName: "trans_id",
                    fieldValue: transId,
                    fieldType: "numeric",
                    fieldKey: "1"
                },{
                    fieldName: "part_id",
                    fieldValue: partId,
                    fieldType: "numeric",
                    fieldKey: "1"
                },{
                    fieldName: "trans_source",
                    fieldValue: 'SALES',
                    fieldType: "string",
                    fieldKey: "1"
                }],
                dt_relatedTables:[],
                tableName:"stock-detail",
                autonumFormat:"",
                modify_status:"DEL"
            }]
        }

        return newTransaction
    }

    async isExistingTransaction(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject['api-validate-distribution'].sql
        var params = {
            sqlStatement: overrideSqlStatement ,
            filter: "",
            keyValue: params,
            secondKeyValue: ""
        }

        let resp = await model.getData(params)
        return resp.data.length > 0 ? true : false
    }

    async getTransactionId(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject['api-validate-distribution'].sql
        var params = {
            sqlStatement: overrideSqlStatement ,
            filter: "",
            keyValue: params
        }

        let resp = await model.getData(params)
        return resp.data.length > 0 ? resp.data[0].id : ''
    }

    async getTransactionLineId(transId, partId){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject['api-get-distribution-lineid'].sql
        var params = {
            sqlStatement: overrideSqlStatement ,
            filter: "",
            keyValue: transId,
            secondKeyValue: partId
        }

        let resp = await model.getData(params)
        return resp.data.length > 0 ? resp.data[0].id : ''
    }

    async getItemId(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject['api-get-partid'].sql
        var params = {
            sqlStatement: overrideSqlStatement ,
            filter: "",
            keyValue: params
        }

        let resp = await model.getData(params)
        return resp.data.length > 0 ? resp.data[0].id : ''
    }


    sanitizeBody(params){
        
        let bodyPost = params
        if (!bodyPost.transNumber) return false
        if (!this.sanitizeValue(bodyPost.transNumber, 'string') ) return false
        
        if (!bodyPost.transDate)  return false
        if (!this.sanitizeValue(bodyPost.transDate, 'date') ) return false
        
        if (!bodyPost.customerId) return false
        if (!this.sanitizeValue(bodyPost.customerId, 'string') ) return false
        
        if (!bodyPost.customerName) return false
        if (!this.sanitizeValue(bodyPost.customerName, 'string') ) return false
        
        if (!bodyPost.lines)  return false
        if (bodyPost.lines.length == 0) return false
        if (!this.sanitizeBodyLine(bodyPost.lines)) return false

        return true
    }

    sanitizeBodyForDeleteRequest(params){
        
        let bodyPost = params
        if (!bodyPost.transNumber) return false
        if (!this.sanitizeValue(bodyPost.transNumber, 'string') ) return false
        
        return true
    }

    sanitizeBodyForDeleteLineRequest(params){
        
        let bodyPost = params
        if (!bodyPost.transNumber) return false
        if (!this.sanitizeValue(bodyPost.transNumber, 'string') ) return false

        if (!bodyPost.partNumber) return false
            if (!this.sanitizeValue(bodyPost.partNumber, 'string') ) return false
        
        return true
    }

    sanitizeBodyLine(params){
        for (let i = 0; i < params.length; i++) {
            const line = params[i];

            if (!line.partNumber) return false
            if (!this.sanitizeValue(line.partNumber, 'string') ) return false
            if (!line.qty)  return false
            if (!this.sanitizeValue(line.qty, 'numeric') ) return false
            if (!line.priceSale)  return false
            if (!this.sanitizeValue(line.priceSale, 'numeric') ) return false

        }

        return true
    }

    sanitizeValue(params, dataType){
        switch (dataType) {
            case 'date':
                // if (typeof new Date(params) === undefined) return false
                break;
            case 'numeric':
                let n = parseInt(params)
                if (!n) return false
                break;
        
            default:
                break;

        }
        return true
    }

    sendMessage(params){
        return {
            status: params.status,
            message: params.message,
            data: params.data
        }
    }


}

module.exports = new PublicController();