const sql = require('mysql');
const mysqlconfig = require('../.././utils/mysqlconfig.json');

var db = sql.createConnection(mysqlconfig)

class CommonModel
{

    constructor(){

    }

    async getData(params) {

        var sqlStatement = params.sqlStatement.replace('FILTER_BY_PROGRAM', params.filter);
        console.log(sqlStatement);

        var result = {
            success: true,
            error: null,
            data: null
        }

        return new Promise(function(resolve, reject){
              db.query(
                sqlStatement, [params.keyValue],
                  function(err, rows){
                      if ( !err ) {
                        if(rows === undefined){
                            result.success = false
                            result.error = 'Error rows is undefined'
                            result.data = []
                            resolve(result);
                        }else{
                            //console.log(sqlStatement, rows); 
                            result.data = rows
                            resolve(result);
                        }
                      }else{
                        //console.log(sqlStatement, params.keyValue); 
                        result.success = false
                        let sanitateError = {
                            errno : null,
                            errcode : null,
                            errmessage: null
                        }
                        sanitateError.errno = err.errno
                        sanitateError.errcode = err.code
                        sanitateError.errmessage = err.sqlMessage
                        result.error = sanitateError
                        result.data = []
                        resolve(result); 
                      }                                              
                  }
              )}
          )
    }

    async getDataTable(params) {

        var sqlStatement = params.sqlStatement.replace('FILTER_BY_PROGRAM', params.filter);
        
        sqlStatement += params.order
        sqlStatement += params.limit
        
        //console.log("getDataTable: ", sqlStatement);
        
        var recordTotal  = await this.getData(params)

        var result = {
            data: [],
            draw: params.draw,
            recordsFiltered: recordTotal.data.length,
            recordsTotal: recordTotal.data.length
        }

        return new Promise(function(resolve, reject){
              db.query(
                sqlStatement, [params.keyValue],
                  function(err, rows){
                      if ( !err ) {
                        if(rows === undefined){
                            resolve(result);
                            //reject(new Error("Error rows is undefined"));
                        }else{
                            var data = []
                            for (var i = 0; i < rows.length; i++) {
                                var dRow = []
                                Object.keys(rows[i]).forEach(function(key) {
                                    var val = rows[i][key];
                                    dRow.push(val)
                                    //console.log('key is: ' + key);
                                    //console.log('val is: ' + val);
                                });
                                data.push(dRow)
                            }
                            
                            result.data = data
                            //result.recordsFiltered = rows.length
                            //result.recordsTotal = rows.length
                            
                            resolve(result);
                        }
                      }else{
                        resolve(result); 
                      }                                              
                  }
              )}
          )
    }

    async getDataForSelectOption(params) {

        var sqlStatement = params.sqlStatement.replace('FILTER_BY_PROGRAM', params.filter);
        //console.log(sqlStatement);

        var result = {
            success: true,
            error: null,
            data: null
        }

        return new Promise(function(resolve, reject){
              db.query(
                sqlStatement, [params.keyValue],
                  function(err, rows){
                      if ( !err ) {
                        if(rows === undefined){
                            result.success = false
                            result.error = 'Error rows is undefined'
                            result.data = []
                            resolve(result);
                        }else{
                            var data = []
                            for (var i = 0; i < rows.length; i++) {
                                //var dRow = []
                               /* Object.keys(rows[i]).forEach(function(key) {
                                    var val = rows[i][key];
                                    dRow.push({id: key, text: val})
                                    //console.log('key is: ' + key);
                                    //console.log('val is: ' + val);
                                });*/
                                if ( rows[i]["notes"]) {
                                    data.push({id: rows[i]["id"], text: rows[i]["description"], notes: rows[i]["notes"]})
                                }else{
                                    data.push({id: rows[i]["id"], text: rows[i]["description"]})
                                }
                                
                            }
                            
                            result.data = data
                            //console.log(result)
                            resolve(result);
                        }
                      }else{
                        console.log(sqlStatement, params.keyValue); 
                        result.success = false
                        let sanitateError = {
                            errno : null,
                            errcode : null,
                            errmessage: null
                        }
                        sanitateError.errno = err.errno
                        sanitateError.errcode = err.code
                        sanitateError.errmessage = err.sqlMessage
                        result.error = sanitateError
                        result.data = []
                        resolve(result); 
                      }                                              
                  }
              )}
          )
    }

    async insertData (params) {

        var sqlStatement = params
        //console.log(sqlStatement)

        var result = {
            success: true,
            error: null,
            data: null
        }

        return new Promise(function(resolve, reject){
            db.query(
              sqlStatement,
                function(err, results){
                    if ( !err ) {
                      result.data = results.insertId
                      resolve(result);
                    }else{
                      result.success = false
                      let sanitateError = {
                          errno : null,
                          errcode : null,
                          errmessage: null,
                          previewSQL: null
                      }
                      sanitateError.errno = err.errno
                      sanitateError.errcode = err.code
                      sanitateError.errmessage = err.sqlMessage
                      sanitateError.previewSQL = sqlStatement
                      result.error = sanitateError
                      resolve(result); 
                    }                                              
                }
            )}
        )
    }

    async updateData (params) {

        var sqlStatement = params
        //console.log(sqlStatement)

        var result = {
            success: true,
            error: null,
            data: null
        }

        return new Promise(function(resolve, reject){
            db.query(
              sqlStatement,
                function(err, results){
                    if ( !err ) {
                      result.data = results.insertId
                      resolve(result);
                    }else{
                      result.success = false
                      let sanitateError = {
                          errno : null,
                          errcode : null,
                          errmessage: null,
                          previewSQL: null
                      }
                      sanitateError.errno = err.errno
                      sanitateError.errcode = err.code
                      sanitateError.errmessage = err.sqlMessage
                      sanitateError.previewSQL = sqlStatement
                      result.error = sanitateError
                      resolve(result); 
                    }                                              
                }
            )}
        )
    }

    async deleteData(params) {
        
        var sqlStatement = params.sqlStatement.replace('FILTER_BY_PROGRAM', params.filter);
        //console.log(sqlStatement);

        var result = {
            success: true,
            error: null,
            data: null
        }

        return new Promise(function(resolve, reject){
              db.query(
                sqlStatement, [params.keyValue],
                  function(err, results){
                      if ( !err ) {
                        result.data = "deleted"
                        resolve(result);
                      }else{
                        result.success = false
                        let sanitateError = {
                            errno : null,
                            errcode : null,
                            errmessage: null
                        }
                        sanitateError.errno = err.errno
                        sanitateError.errcode = err.code
                        sanitateError.errmessage = err.sqlMessage
                        result.error = sanitateError
                        resolve(result); 
                      }                                              
                  }
              )}
          )
    };
}

module.exports = new CommonModel();