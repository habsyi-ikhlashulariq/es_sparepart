const maskMoneyOptions = {
    thousands : ',',
    decimal : '.',
    precision : 0,
    allowZero : true,
    prefix : ''
  }
  
  const select2Options = function (params) {
    return {
      placeholder: params.placeholder, //"- choose type -",
      ajax: {
          url: `${app_url}api/general/${params.objectName}/0/option`,
          dataType: 'json',
          data: function (params) {
            var query = {
              search: params.term,
              type: 'public'
            }
      
            // Query parameters will be ?search=[term]&type=public
            return query;
          },
          processResults: function (data) {
              console.log(data)
              // Transforms the top-level key of the response object from 'items' to 'results'
              return {
                results: data.data
              };
          }
          // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
        }
    }
  }
  
  
  $("#supplierId").select2(select2Options({
    placeholder: '- choose supplier -',
    objectName: 'supplier'
  }));
  
  $('#button-add-sparepart').on('click', function(el) {
    el.preventDefault();
    var rowCounter = $("#sparepart tr").length - 2;
    var newAttribute = `<tr id="sparepart-row-${rowCounter}">
                          <td class="text-center" style="vertical-align: middle;">
                            <button class="btn btn-xs btn-danger" type="button" onclick="$(this).tooltip('destroy'); deleteItem(${rowCounter},'sparepart');" data-toggle="tooltip" title="" data-original-title="delete" aria-describedby="tooltip483671"><i class="fa fa-trash"></i></button></td>
                          <td>
                            <input class="form-control typeahead" nosave="true" id="sparepart-name-${rowCounter}" type="text" placeholder="Enter Sparepart Desc" name="sparepart[${rowCounter}][sparepart]" data-source="sparepart" autocomplete="off">
                            <input id="sparepart-autonumber-${rowCounter}" nosave="true" type="hidden" name="sparepart[${rowCounter}][autonumber]" value="">
                            <input id="sparepart-id-${rowCounter}" nosave="true" type="hidden" name="sparepart[${rowCounter}][part_name]" value="">
                          </td>
                          <td>
                            <input class="form-control" nosave="true" id="sparepart-qty-in-${rowCounter}" type="text" placeholder="Enter QTY" name="sparepart[${rowCounter}][qty_in]" autocomplete="false">
                          </td>
                        </tr>`
    $('#addSparepart').before(newAttribute);
  
    attachTypeHeadEvent($(`#sparepart-name-${rowCounter}`))
  
  
    $('.input-price').maskMoney(maskMoneyOptions);
  
  })
  
  $(document).on('click', '.form-control.typeahead', function() {
    attachTypeHeadEvent(this)
  });
  
  $('.input-price').maskMoney(maskMoneyOptions);
  
  $('.input-price').trigger('focusout');
  
  function deleteItem(index, objectName){
    let targetId = $(`#${objectName}-autonumber-${index}`).val()
    executeDeleteObject(targetId, objectName, function(){
      $(`#${objectName}-row-${index}`).remove()
    })
  }
  
  function attachTypeHeadEvent(object){
    var dataSource = $(object).attr('data-source')
    var _autocomplete_path = _autocomplete_generic_path.replace('replacethis', dataSource)
  
    input_id = $(object).attr('id').split('-');
  
    item_id = parseInt(input_id[input_id.length-1]);
    console.log(item_id)
    $(object).typeahead({
        minLength: 2,
        displayText:function (data) {
            return data.description;
        },
        source: function (query, process) {
            $.ajax({
                url: _autocomplete_path,
                type: 'GET',
                dataType: 'JSON',
                data: 'query=' + query + '&type=product&currency_code=IDR',
                success: function(data) {
                    return process(data.data);
                }
            });
        },
        afterSelect: function (data) {
          afterSelect(dataSource, data)
        }
    });
  }
  
  function afterSelect(object, data){
    switch (object) {
      case "sparepart":
          $('#sparepart-id-' + item_id).val(data.id);
          $('#sparepart-desc-' + item_id).focus();
        break;
      default:
        break;
    }
  }
  
  function callbackSaveRelated(returnId){
    let sparepartLength = $("#sparepart tr").length - 2
  
    var dtAccess=new dataAccess();
    
    var index = 0
    for ( index = 0; index < sparepartLength; index++ ) {
      if ( index == 0 ) {
        if( $(`#sparepart-autonumber-${index}`).val() == "" ){
          dtAccess.initialize("stock_detail","","INS");
        }else{
          dtAccess.initialize("stock_detail","","UPD");
          dtAccess.addItem("autonumber",$(`#sparepart-autonumber-${index}`).val(),"numeric","1","");
        }
  
        dtAccess.addItem("part_id",$(`#sparepart-id-${index}`).val(),"numeric","0","");
        dtAccess.addItem("trans_id",returnId,"numeric","0","");
        dtAccess.addItem("qty_in",$(`#sparepart-qty-in-${index}`).val(),"string","0","");
      }else{
        if( $(`#sparepart-autonumber-${index}`).val() == "" ){
          dtAccess.addRelatedTable("stock_detail","","INS");
        }else{
          dtAccess.addRelatedTable("stock_detail","","UPD");
          dtAccess.addItemRelated(index-1,"autonumber",$(`#sparepart-autonumber-${index}`).val(),"numeric","1","");
        } 
  
        dtAccess.addItemRelated(index-1,"part_id",$(`#sparepart-id-${index}`).val(),"numeric","0","");
        dtAccess.addItemRelated(index-1,"trans_id",returnId,"numeric","0","");
        dtAccess.addItemRelated(index-1,"qty_in",$(`#sparepart-qty-in-${index}`).val(),"string","0","");
      }
    }
  
    var jsonData = dtAccess.getJSONstring();
    console.log(jsonData)
  
    $.ajax({
      url: app_url + _API_END_POINT ,
      type: 'POST',
      contentType: 'application/json',
      data: dtAccess.getJSONstring(),
      headers: { 'X-CSRF-TOKEN': '123456' },
      beforeSend: function() {
        $(".button-submit").text(" Loading ...")  
      },
      success: function(json) {
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
    });
  
  }
  
  function executeDeleteObject(objectId, objectName, callback){
    var dtAccess=new dataAccess();
    var tableName = "undefined"
    switch (objectName) {
      case 'sparepart':
        tableName = "stock-detail"
        break;
    
      default:
        break;
    }
    dtAccess.initialize(tableName,"","DEL");
    dtAccess.addItem("autonumber",objectId,"numeric","1","");
  
    var jsonData = dtAccess.getJSONstring();
    console.log(objectId, jsonData)
    
    $.ajax({
      url: app_url + _API_END_POINT ,
      type: 'DELETE',
      contentType: 'application/json',
      data: dtAccess.getJSONstring(),
      headers: { 'X-CSRF-TOKEN': '123456' },
      beforeSend: function() {
        //$(".button-submit").text(" Loading ...")  
      },
      success: function(json) {
        if (json['success']) {
            callback()
        }else{
            $.notify({
                message: json["error"].errmessage
            },{
                type: 'error'
            });
        }
      }
    });
  
  }