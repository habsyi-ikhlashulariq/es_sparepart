const model = require('.././Models/commonModel.js');
const sqlcollection = require('../.././utils/sqlcollection.json');

class CommonController
{
    constructor(){
        
    }

    async testRead(){
        var params = {
            sqlStatement: "SELECT * FROM administrator",
            filter: ""
        }
        let result = await model.getData(params)
        return result
    }

    async getObjectData(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].sql
        var params = {
            sqlStatement: overrideSqlStatement ? overrideSqlStatement : "SELECT "+ this.getSelectedColumnForDataTable(params.objectName) + " FROM `" + this.getRealTableName(params.objectName) + "` FILTER_BY_PROGRAM",
            filter: params.objectId != "" ? "WHERE " + this.getObjectKey(params.objectName) + " = ?" : "",
            keyValue: params.objectId
        }
        let result = await model.getData(params)
        return result
    }

    async getDynamicObjectData(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName][params.objectSQlNode]
        var params = {
            sqlStatement: overrideSqlStatement,
            filter: "",
            keyValue: params.objectId
        }
        console.log(params)
        let result = await model.getData(params)
        return result
    }

    async getObjectDataTable(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].sql || null
        var params = {
            sqlStatement: overrideSqlStatement ? overrideSqlStatement : "SELECT "+ this.getSelectedColumnForDataTable(params.objectName) + " FROM `" + this.getRealTableName(params.objectName) + "` FILTER_BY_PROGRAM",
            filter: params.searchValue != "" ? " WHERE " + this.getObjectSearchKey(params.objectName) + " like '%" +params.searchValue+ "%'"  : " WHERE 1=1 ",
            limit: " LIMIT "+params.start+","+params.length,
            order: overrideSqlStatement ? "" : " ORDER BY " + this.getOrderByKey(params.objectName),
            dataTable: params.dataTable,
            draw: params.draw
        }
        
        let result = await model.getDataTable(params)
        return result
    }

    async getObjectForSelectOption(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].option
        var params = {
            sqlStatement: overrideSqlStatement,
            filter: params.objectKey != "" ? ` WHERE ${this.getObjectSearchKey(params.objectName)} Like '%${params.objectKey}%'` : ""
        }
        //console.log(params)
        let result = await model.getDataForSelectOption(params)
        return result
    }
    
    async getObjectForAutoComplete(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].autocomplete
        var params = {
            sqlStatement: overrideSqlStatement,
            filter: params.objectKey != "" ? ` WHERE status = 1 ${this.getAutocompleteFilter(params.objectName, params.objectKey)} ` : ""
        }
        console.log(params)
        let result = await model.getData(params)
        return result
    }

    async getObjectForAutoCompleteCustom(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].autocomplete_custom
        var params = {
            sqlStatement: overrideSqlStatement,
            filter: params.objectKey != "" ? `  ${this.getAutocompleteFilter(params.objectName, params.objectKey)} ` : "",
            keyValue: params.customKey
        }
        console.log(params)
        let result = await model.getData(params)
        return result
    }

    async getRelatedObjectData(params){
        var sqlColObject = sqlcollection
        var relatedSQLCols = sqlColObject[params.objectName].related || []
        var relatedDataCols = []
        var myParams = params
        if ( relatedSQLCols.length == 0) return []
        return new Promise((resolve, reject) => {
            var sqlCount = relatedSQLCols.length
            relatedSQLCols.forEach(async(sql) => {
                var params = {
                    sqlStatement: sql,
                    filter: "",
                    keyValue: myParams.objectId
                }
                
                let result = await model.getData(params)
                relatedDataCols.push({data: result.data})
                //console.log(JSON.stringify(result.data))
                sqlCount--
                if ( sqlCount < 1 ) resolve(relatedDataCols)
            });
            
        })
    }

    async getObjectDataForItem(params){
        var sqlColObject = sqlcollection
        var overrideSqlStatement = sqlColObject[params.objectName].item
        var params = {
            sqlStatement: overrideSqlStatement ? overrideSqlStatement : "SELECT "+ this.getSelectedColumnForDataTable(params.objectName) + " FROM `" + this.getRealTableName(params.objectName) + "` FILTER_BY_PROGRAM",
            filter: "",
            keyValue: params.objectId
        }
        console.log(params)
        let result = await model.getData(params)
        return result
    }

    async insertObjectData(params) {
        //console.log("objectValue:",params.objectValue)
        var myObject = params.objectValue[0].dt_fieldsCollection
        for(var col in myObject){
            //console.log(myObject[col].fieldName+": "+myObject[col].fieldValue)
        }
        let sqlStatement = this.queryGenerator('INS', params)
        let result = await model.insertData(sqlStatement)
        return result
    }

    async updateObjectData(params) {
        var myObject = params.objectValue[0].dt_fieldsCollection
        for(var col in myObject){
            //console.log(myObject[col].fieldName+": "+myObject[col].fieldValue)
        }
        let sqlStatement = this.queryGenerator('UPD', params)
        let result = await model.updateData(sqlStatement)
        return result
    }

    async deleteObjectData(params) {
        var myObject = params.objectValue[0].dt_fieldsCollection
        for(var col in myObject){
            //console.log(myObject[col].fieldName+": "+myObject[col].fieldValue)
        }
        let sqlStatement = this.queryGenerator('DEL', params)
        console.log(sqlStatement)
        let result = await model.updateData(sqlStatement)
        return result
    }

    async deleteObjectDataDirect(params){
        var params = {
            sqlStatement: "DELETE FROM `" + params.objectName + "` FILTER_BY_PROGRAM",
            filter: "WHERE " + params.objectKey+ " = ?",
            keyValue: params.objectId
        }
        let result = await model.deleteData(params)
        return result
    }

    generateAutoNumberBasedOnTime(objectName)
    {
        let d = new Date()
        let startWith = this.getAutonumberStartWith(objectName)
        return `${startWith}-${this.getFullDates(d, "")}${this.getFullTimes(d, "")}`
    }

    getFullDates(date,splitter) {
        let year = `${date.getFullYear()}`
        let month =`0${date.getMonth()+1}`
        let day = `0${date.getDate()}`
        return `${year}${splitter}${month.substring(month.length-2,month.length)}${splitter}${day.substring(day.length-2,day.length)}`
    }

    getFullTimes(date, splitter) {
        let hours = `0${date.getHours()}`
        let minutes =`0${date.getMinutes()}`
        let seconds = `0${date.getSeconds()}`
        return `${hours.substring(hours.length-2,hours.length)}${splitter}${minutes.substring(minutes.length-2,minutes.length)}${splitter}${seconds.substring(seconds.length-2,seconds.length)}`
    }

    getAutonumberStartWith(objectName){
        var startWith = '0'
        switch (objectName) {
            case 'receiving-goods':
                startWith = 'RG';
                break;
            default:
                break;
        }
        return startWith
    }

    getRelatedObject(objectName){
        switch (objectName) {
            case "product-category":
                
                break;
        
            default:
                break;
        }
    }

    getSelectedModule(objectName){
        var selectedModule = 2
        switch (objectName) {
            case 'supplier':
            case 'customer':
            case 'sparepart':
            case 'receiving-goods':
            case 'distribution-goods':
            case 'stock-detail':
                selectedModule = 1;
                break;
            default:
                break;
        }
        return selectedModule
    }

    getRealTitleName(objectName){
        var realTtitleName = objectName
        switch (objectName) {
            case 'supplier':
                realTtitleName = 'Supplier';
                break;
            case 'receiving-goods':
                realTtitleName = 'Receiving Goods';
                break;
            case 'sparepart':
                realTtitleName = 'Sparepart';
                break;
            case 'distribution-goods':
                realTtitleName = 'Distribution Goods';
                break;
            case 'stock-detail':
                realTtitleName = 'Stock Detail';
                break;
            default:
                break;
        }
        return realTtitleName
    }

    getRealTableName(objectName){
        var realTableName = objectName
        switch (objectName) {
            
            case 'supplier':
                realTableName = 'supplier';
                break;
            case 'receiving-goods':
                realTableName = 'receiving_goods';
                break;
            case 'sparepart':
                realTableName = 'sparepart';
                break;
            case 'distribution-goods':
                realTableName = 'distribution_goods';
                break;
            case 'stock-detail':
                realTableName = 'stock_detail';
                break;
            default:
                realTableName = objectName
                break;
        }
        return realTableName
    }

    getSelectedColumn(objectName){
        var selectedCols = ""
        switch (objectName) {
            case 'course-caetgory':
                selectedCols = "uuid, code, description, case when status =1 then 'Yes' else 'No' end as status"
                break;
            
            default:
                break;
        }
        return selectedCols
    }

    getSelectedColumnForDataTable(objectName){
        var selectedCols = ""
        switch (objectName) {
            case 'course-category':
                selectedCols = 'uuid, code, description, status';
                break;
            default:
                break;
        }
        return selectedCols
    }

    getObjectKey(objectName){
        var objectKey = ""
        switch (objectName) {
            case 'supplier':
                objectKey = 'a.uuid'
                break;
            case 'receiving-goods':
                objectKey = 'a.uuid'
                break;
            case 'sparepart':
                objectKey = 'a.uuid'
                break;
            case 'distribution-goods':
                objectKey = 'a.uuid'
                break;
            case 'stock-detail':
                objectKey = 'a.uuid'
                break;
            default:
                break;
        }
        return objectKey
    }

    getObjectSearchKey(objectName){
        var objectKey = ""
        switch (objectName) {
            case 'supplier':
                objectKey = 'supplier_name'
                break;
            case 'receiving-goods':
                objectKey = 'supplier_name'
                break;
            case 'sparepart':
                objectKey = 'part_number'
                break;
            case 'distribution-goods':
                objectKey = 'trans_number'
                break;
            default:
                break;
        }
        return objectKey
    }

    getAutocompleteFilter(objectName, keyword){
        var objectFilters = ""
        switch (objectName) {
            case 'grade':
                objectFilters = ` AND ( code Like '%${keyword}%' 
                    or description Like '%${keyword}%' )`
                break;
            case 'course':
                objectFilters = ` AND ( code Like '%${keyword}%' 
                    or description Like '%${keyword}%' )`
                break;
            case 'user-roles':
                objectFilters = ` AND ( code Like '%${keyword}%' 
                    or role Like '%${keyword}%' )`
                break;
            case 'receiving-goods':
                objectFilters = ` AND ( part_number Like '%${keyword}%' 
                    or part_desc Like '%${keyword}%' )`
                break;
            case 'sparepart':
                objectFilters = ` AND ( part_number Like '%${keyword}%' 
                    or part_desc Like '%${keyword}%' )`
                break;
            default:
                break;
        }
        return objectFilters
    }

    getOrderByKey(objectName){
        var orderBy = ""
        switch (objectName) {
            case 'supplier':
                orderBy = ' supplier_code ASC '
                break;
            case 'receiving-goods':
                orderBy = ' trans_number ASC '
                break;
            case 'sparepart':
                orderBy = ' part_number ASC '
                break;
            case 'distribution-goods':
                orderBy = ' trans_number ASC '
                break;
            case 'stock-detail':
                orderBy = ' trans_id ASC '
                break;
            default:
                break;
        }
        return orderBy
    }

    queryGenerator(mode,params) {
        //var objectName = params.objectName
        var sqlStatement = ""

        var object = {
            fieldCollection: params.objectValue[0].dt_fieldsCollection,
            updMode: params.objectValue[0].modify_status,
            tableName: this.getRealTableName(params.objectValue[0].tableName)
        }

        sqlStatement = this.generateQuery(object) + ';'

        var relObjects = params.objectValue[0].dt_relatedTables
        //console.log("relObjects:", relObjects)
        relObjects.forEach(element => {
            var relObject = {
                fieldCollection: element.dt_relatedTable[0].dt_relfieldCollection,
                updMode: element.dt_relatedTable[0].modify_status,
                tableName: element.dt_relatedTable[0].tableName
            }

            sqlStatement += this.generateQuery(relObject) + ';'
        });
        
        return sqlStatement
    }

    generateQuery(object) {
        var myObject = object.fieldCollection
        var updMode = object.updMode
        var tableName = object.tableName
        var sqlStatement = ""
        switch (updMode) {
            case 'INS':
                sqlStatement += `INSERT INTO ${tableName} (uuid,`
                var counter = 0
                for(var col in myObject){
                    if ( myObject[col].fieldType != 'auth'){
                        if (counter > 0) sqlStatement += ','
                        sqlStatement += myObject[col].fieldName
                        counter++
                    } 
                }
                sqlStatement += ') VALUES (uuid(),'
                counter = 0
                for(var col in myObject){
                    if ( myObject[col].fieldType != 'auth'){
                        if (counter > 0) sqlStatement += ','
                        switch (myObject[col].fieldType) {
                            case 'string':
                                sqlStatement += `'${myObject[col].fieldValue}'`
                                break;
                            case 'date':
                                sqlStatement += `'${myObject[col].fieldValue}'`
                                break;
                            case 'password':
                                sqlStatement += `'${myObject[col].fieldValue}'`
                                break;
                            case 'numeric':
                                sqlStatement += myObject[col].fieldValue
                                break;
                            case 'decimal':
                                let decValue = myObject[col].fieldValue
                                sqlStatement += decValue.toString().replace(",",".")
                                break;
                            default:
                                sqlStatement += `'${myObject[col].fieldValue}'`
                                break;
                        }
                    
                        counter++
                    }
                }
                sqlStatement += ')'
                break;
            case "UPD":
                    sqlStatement += `UPDATE ${tableName} SET `
                    var counter = 0
                    for(var col in myObject){
                        if ( myObject[col].fieldType != 'auth' && myObject[col].fieldKey != '1'){
                            if (counter > 0) sqlStatement += ','
                            sqlStatement += myObject[col].fieldName

                            switch (myObject[col].fieldType) {
                                case 'string':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'date':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'password':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'numeric':
                                    sqlStatement += `= ${myObject[col].fieldValue}`
                                    break;
                                case 'decimal':
                                    let decValue = myObject[col].fieldValue
                                    sqlStatement += `= ${decValue.toString().replace(",",".")}`
                                    break;
                                default:
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                            }

                            counter++
                        } 
                    }
                    sqlStatement += ' WHERE '
                    counter = 0
                    for(var col in myObject){
                        if ( myObject[col].fieldType != 'auth' && myObject[col].fieldKey == '1'){
                            if (counter > 0) sqlStatement += ' AND '
                            sqlStatement += myObject[col].fieldName

                            switch (myObject[col].fieldType) {
                                case 'string':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'date':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'password':
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                                case 'numeric':
                                    sqlStatement += `= ${myObject[col].fieldValue}`
                                    break;
                                case 'decimal':
                                    sqlStatement += `= ${myObject[col].fieldValue}`
                                    break;
                                default:
                                    sqlStatement += `= '${myObject[col].fieldValue}'`
                                    break;
                            }
                        
                            counter++
                        }
                    }
                    
                break;
            case "DEL":
                tableName = this.getRealTableName(tableName)
                sqlStatement += `DELETE FROM ${tableName} `
                var counter = 0
                sqlStatement += ' WHERE '
                counter = 0
                for(var col in myObject){
                    if ( myObject[col].fieldType != 'auth' && myObject[col].fieldKey == '1'){
                        if (counter > 0) sqlStatement += ' AND '
                        sqlStatement += myObject[col].fieldName

                        switch (myObject[col].fieldType) {
                            case 'string':
                                sqlStatement += `= '${myObject[col].fieldValue}'`
                                break;
                            case 'date':
                                sqlStatement += `= '${myObject[col].fieldValue}'`
                                break;
                            case 'password':
                                sqlStatement += `= '${myObject[col].fieldValue}'`
                                break;
                            case 'numeric':
                                sqlStatement += `= ${myObject[col].fieldValue}`
                                break;
                            case 'decimal':
                                sqlStatement += `= ${myObject[col].fieldValue}`
                                break;
                            default:
                                sqlStatement += `= '${myObject[col].fieldValue}'`
                                break;
                        }
                    
                        counter++
                    }
                }
                    
                break;
            default:
                break;
        }
        //console.log(sqlStatement)
        return sqlStatement
    }

}

module.exports = new CommonController();