const model = require('.././Models/commonModel.js');
const sqlcollection = require('../.././utils/sqlcollection.json');

class PublicController
{
    constructor(){
        
    }
    sanitizeBody(params){
        
        let bodyPost = params.objectBody
        if (!bodyPost.transNumber) return false
        if (!this.sanitizeValue(bodyPost.transNumber, 'string') ) return false
        if (!bodyPost.transDate)  return false
        if (!this.sanitizeValue(bodyPost.transDate, 'date') ) return false
        if (!bodyPost.lines)  return false
        if (bodyPost.lines.length == 0) return false
        

        if (!this.sanitizeBodyLine(bodyPost.lines)) return false
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


}

module.exports = new PublicController();