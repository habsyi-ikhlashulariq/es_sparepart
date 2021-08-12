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
  
  
  $("#userRoleId").select2(select2Options({
    placeholder: '- User Role -',
    objectName: 'user-roles'
  }));
  
  $('#button-add-menu').on('click', function(el) {
    el.preventDefault();
    var rowCounter = $("#menu tr").length - 2;
    var newAttribute = `<tr id="menu-row-${rowCounter}">
                          <td class="text-center" style="vertical-align: middle;">
                            <button class="btn btn-xs btn-danger" type="button" onclick="$(this).tooltip('destroy'); deleteItem(${rowCounter},'menu');" data-toggle="tooltip" title="" data-original-title="delete" aria-describedby="tooltip483671"><i class="fa fa-trash"></i></button></td>
                          <td>
                            <input class="form-control typeahead" nosave="true" id="menu-name-${rowCounter}" type="text" placeholder="Enter Menu" name="menu[${rowCounter}][menu]" data-source="menu" autocomplete="off">
                            <input id="menu-autonumber-${rowCounter}" nosave="true" type="hidden" name="menu[${rowCounter}][autonumber]" value="">
                            <input id="menu-id-${rowCounter}" nosave="true" type="hidden" name="menu[${rowCounter}][menu_id]" value="">
                          </td>
                        </tr>`
    $('#addMenu').before(newAttribute);
  
    attachTypeHeadEvent($(`#menu-name-${rowCounter}`))
  
  
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
      case "menu":
          $('#menu-id-' + item_id).val(data.id);
        break;
      default:
        break;
    }
  }
  
  function callbackSaveRelated(returnId){
    let menuLength = $("#menu tr").length - 2
  
    var dtAccess=new dataAccess();
    
    var index = 0
    for ( index = 0; index < menuLength; index++ ) {
      if ( index == 0 ) {
        if( $(`#menu-autonumber-${index}`).val() == "" ){
          dtAccess.initialize("user_roles","","INS");
        }else{
          dtAccess.initialize("user_roles","","UPD");
          dtAccess.addItem("autonumber",$(`#menu-autonumber-${index}`).val(),"numeric","1","");
        }
  
        dtAccess.addItem("menu_id",$(`#menu-id-${index}`).val(),"numeric","0","");
        // dtAccess.addItem("course_id",returnId,"numeric","0","");
      }else{
        if( $(`#menu-autonumber-${index}`).val() == "" ){
          dtAccess.addRelatedTable("user_roles","","INS");
        }else{
          dtAccess.addRelatedTable("user_roles","","UPD");
          dtAccess.addItemRelated(index-1,"autonumber",$(`#menu-autonumber-${index}`).val(),"numeric","1","");
        } 
  
        dtAccess.addItemRelated(index-1,"menu_id",$(`#menu-id-${index}`).val(),"numeric","0","");
        // dtAccess.addItemRelated(index-1,"course_id",returnId,"numeric","0","");
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
      case 'menu':
        tableName = "user_roles"
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