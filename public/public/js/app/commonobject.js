function numberFormat(value){
    return numeral(value).format('0,0.00')
}

function showNotification(message, type){
    $.notify({
        message: message
    },{
        type: type
    });
}


function saveEntry(mode){
    //if (confirm('Are you sure you want to save this update into the database?')) {
        // Save it!
        //if(onValidationProcess)return false;

        var dtAccess=new dataAccess();
        var actionValidation=true;
        var dataKey="0";
        var upperCase=true;
        var prevObjectProcessed='';
        dtAccess.initialize(_OBJECT_NAME,"",mode);

        $("#mainForm").find(":input").each(function() {
            var nosaveFlag = $(this).attr("nosave");
            //console.log($(this).attr("name"),nosaveFlag)
            if ( $(this).attr("name")!= "undefined" && (typeof nosaveFlag == "undefined" || nosaveFlag != "true")) {
                var relTblIndex = $(this).attr("relatedTblIndex");

                if ( $(this).attr("data-mandatory")=="true") {
                    if ($(this).val()==""){
                        alert($(this).attr("validation-string")+" field doesn't accepted without a value!");
                        if ( typeof relTblIndex != "undefined" ) {
                            switch (parseInt(relTblIndex)){
                                case 0:
                                    $("#entrypemohon").trigger("click");
                                    break
                                case 1:
                                    $("#entrystnk").trigger("click");
                                    break;
                            }
                        }
                        actionValidation = false;
                        return false;
                    }
                }

                if (typeof $(this).attr("dataKey") == "undefined" ) {
                    dataKey="0";
                }else{
                    dataKey	=  $(this).attr("dataKey");
                }

                if (typeof $(this).attr("data-case") == "undefined" ) {
                    upperCase=true;
                }else{
                    if($(this).attr("data-case")=="0"){
                        upperCase =  false;
                    }
                }
                if($(this).attr("type") == "radio") {
                    if($(this).attr("checked")) {
                        dtAccess.addItem($(this).attr("name"),$(this).val(),$(this).attr("dataType"),dataKey,$(this).attr("data-flag"));
                    }
                }else{
                    dtAccess.addItem($(this).attr("name"),$(this).val(),$(this).attr("dataType"),dataKey,$(this).attr("data-flag"));
                }
            }
        });
        //console.log(dtAccess.getJSON());
        $.ajax({
            url: app_url + _API_END_POINT ,
            type: mode == 'INS' ?  'POST' : 'PUT',
            contentType: 'application/json',
            data: dtAccess.getJSONstring(),
            headers: { 'X-CSRF-TOKEN': '123456' },
            beforeSend: function() {
              $(".button-submit").text(" Loading ...")  
            },
            success: function(json) {
                var returnId = json['data']
                console.log(returnId)
                if ( typeof _has_related_objects !== 'undefined' ){
                    returnId = returnId == "" ? $("#_parentId").val() : returnId
                    if (json['success']) {
                        callbackSaveRelated(returnId)
                    }else{
                        $.notify({
                            message: json["error"].errmessage
                        },{
                            type: 'error'
                        });
                        $(".button-submit").text(" Error ...")  
                    }
                }else{
                    if (json['success']) {
                        $.notify({
                            message: 'Updating database completed ...'
                        },{
                            type: 'warning'
                        });

                        setTimeout(function() {
                            window.location = app_url + _LIST_URL
                        }, 4500);
                    
                    }else{
                        $.notify({
                            message: json["error"].errmessage
                        },{
                            type: 'error'
                        });
                        $(".button-submit").text(" Error ...")  
                    }
                }
            }
        });

        //if(!actionValidation){
            return false;
        //}
    //} else {
        // Do nothing!
      //  return false;
    //}
}

