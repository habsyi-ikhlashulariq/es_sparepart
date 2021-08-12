const maskMoneyOptions = {
  thousands : ',',
  decimal : '.',
  precision : 0,
  allowZero : true,
  prefix : ''
}

$('#button-add-course').on('click', function(el) {
  el.preventDefault();
  var rowCounter = $("#course tr").length - 2;
  var newAttribute = `<tr id="course-row-${rowCounter}">
                        <td class="text-center" style="vertical-align: middle;">
                          <button class="btn btn-xs btn-danger" type="button" onclick="$(this).tooltip('destroy'); deleteItem(${rowCounter},'course', 'course-handled');" data-toggle="tooltip" title="" data-original-title="delete" aria-describedby="tooltip483671"><i class="fa fa-trash"></i></button></td>
                        <td>
                          <input class="form-control typeahead" nosave="true" id="course-name-${rowCounter}" type="text" placeholder="Enter Course" name="course[${rowCounter}][course]" data-source="course" autocomplete="off">
                          <input id="course-autonumber-${rowCounter}" nosave="true" type="hidden" name="course[${rowCounter}][autonumber]" value="">
                          <input id="course-id-${rowCounter}" nosave="true" type="hidden" name="course[${rowCounter}][course_id]" value="">
                        </td>
                        <td>
                          <input class="form-control text-right input-price" nosave="true" id="course-fee-${rowCounter}" type="text" name="course[${rowCounter}][course_fee]" value="0"  autocomplete="false">
                        </td>
                      </tr>`
  $('#addCourse').before(newAttribute);

  attachTypeHeadEvent($(`#course-name-${rowCounter}`))


  $('.input-price').maskMoney(maskMoneyOptions);

})

$(document).on('click', '.form-control.typeahead', function() {
  attachTypeHeadEvent(this)
});

$('.input-price').maskMoney(maskMoneyOptions);

$('.input-price').trigger('focusout');

function deleteItem(index, objectName, targetName){
  let targetId = $(`#${objectName}-autonumber-${index}`).val()
  executeDeleteObject(targetId, targetName, function(){
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
    case "course":
        $('#course-id-' + item_id).val(data.id);
        $('#course-fee-' + item_id).focus();
      break;
    default:
      break;
  }
}

function callbackSaveRelated(productId){
  let courseLength = $("#course tr").length - 2

  var dtAccess=new dataAccess();
  
  var index = 0
  for ( index = 0; index < courseLength; index++ ) {
    if ( index == 0 ) {
      if( $(`#course-autonumber-${index}`).val() == "" ){
        dtAccess.initialize("course_handled","","INS");
      }else{
        dtAccess.initialize("course_handled","","UPD");
        dtAccess.addItem("autonumber",$(`#course-autonumber-${index}`).val(),"numeric","1","");
      }
      dtAccess.addItem("teacher_id",productId,"numeric","0","");
      dtAccess.addItem("course_id",$(`#course-id-${index}`).val(),"numeric","0","");
      dtAccess.addItem("course_fee",$(`#course-fee-${index}`).val().replace(",",""),"numeric","0","");
    }else{
      if( $(`#course-autonumber-${index}`).val() == "" ){
        dtAccess.addRelatedTable("course_handled","","INS");
      }else{
        dtAccess.addRelatedTable("course_handled","","UPD");
        dtAccess.addItemRelated(index-1,"autonumber",$(`#course-autonumber-${index}`).val(),"numeric","1","");
      } 

      dtAccess.addItemRelated(index-1,"teacher_id",productId,"numeric","0","");
      dtAccess.addItemRelated(index-1,"course_id",$(`#course-id-${index}`).val(),"numeric","0","");
      dtAccess.addItemRelated(index-1,"course_fee",$(`#course-fee-${index}`).val().replace(",",""),"numeric","0","");
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
    case 'course-handled':
      tableName = "course-handled"
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