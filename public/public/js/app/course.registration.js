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


$("#category").select2(select2Options({
  placeholder: '- choose type -',
  objectName: 'registration-category'
}));

$('#button-add-grade').on('click', function(el) {
  el.preventDefault();
  var rowCounter = $("#grade tr").length - 2;
  var newAttribute = `<tr id="grade-row-${rowCounter}">
                        <td class="text-center" style="vertical-align: middle;">
                          <button class="btn btn-xs btn-danger" type="button" onclick="$(this).tooltip('destroy'); deleteItem(${rowCounter},'grade');" data-toggle="tooltip" title="" data-original-title="delete" aria-describedby="tooltip483671"><i class="fa fa-trash"></i></button></td>
                        <td>
                          <input class="form-control typeahead" nosave="true" id="grade-name-${rowCounter}" type="text" placeholder="Enter Grade" name="grade[${rowCounter}][grade]" data-source="grade" autocomplete="off">
                          <input id="grade-autonumber-${rowCounter}" nosave="true" type="hidden" name="grade[${rowCounter}][autonumber]" value="">
                          <input id="grade-id-${rowCounter}" nosave="true" type="hidden" name="grade[${rowCounter}][grade_id]" value="">
                        </td>
                        <td>
                          <input class="form-control" nosave="true" id="grade-description-${rowCounter}" type="text" placeholder="Enter Description" name="grade[${rowCounter}][description]" autocomplete="false">
                        </td>
                        <td>
                          <input class="form-control text-center" nosave="true" id="grade-quota-${rowCounter}" type="text" name="grade[${rowCounter}][quota]" value="1" autocomplete="false">
                        </td>
                        <td>
                          <input class="form-control text-right input-price" nosave="true" id="grade-reg-fee-${rowCounter}" type="text" name="grade[${rowCounter}][reg_fee]" value="0"  autocomplete="false">
                        </td>
                        <td>
                          <input class="form-control text-right input-price" nosave="true" id="grade-course-fee-${rowCounter}" type="text" name="grade[${rowCounter}][course_fee]" value="0"  autocomplete="false">
                        </td>
                      </tr>`
  $('#addGrade').before(newAttribute);

  attachTypeHeadEvent($(`#grade-name-${rowCounter}`))


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
    case "grade":
        $('#grade-id-' + item_id).val(data.id);
        $('#grade-description-' + item_id).focus();
      break;
    default:
      break;
  }
}

function callbackSaveRelated(productId){
  let gradeLength = $("#grade tr").length - 2

  var dtAccess=new dataAccess();
  
  var index = 0
  for ( index = 0; index < gradeLength; index++ ) {
    if ( index == 0 ) {
      if( $(`#grade-autonumber-${index}`).val() == "" ){
        dtAccess.initialize("course_grading","","INS");
      }else{
        dtAccess.initialize("course_grading","","UPD");
        dtAccess.addItem("autonumber",$(`#grade-autonumber-${index}`).val(),"numeric","1","");
      }

      dtAccess.addItem("grade_id",$(`#grade-id-${index}`).val(),"numeric","0","");
      dtAccess.addItem("course_id",productId,"numeric","0","");
      dtAccess.addItem("description",$(`#grade-description-${index}`).val(),"string","0","");
      dtAccess.addItem("quota",$(`#grade-quota-${index}`).val(),"numeric","0","");
      dtAccess.addItem("reg_fee",$(`#grade-reg-fee-${index}`).val().replace(",",""),"numeric","0","");
      dtAccess.addItem("course_fee",$(`#grade-course-fee-${index}`).val().replace(",",""),"numeric","0","");
    }else{
      if( $(`#grade-autonumber-${index}`).val() == "" ){
        dtAccess.addRelatedTable("course_grading","","INS");
      }else{
        dtAccess.addRelatedTable("course_grading","","UPD");
        dtAccess.addItemRelated(index-1,"autonumber",$(`#grade-autonumber-${index}`).val(),"numeric","1","");
      } 

      dtAccess.addItemRelated(index-1,"grade_id",$(`#grade-id-${index}`).val(),"numeric","0","");
      dtAccess.addItemRelated(index-1,"course_id",productId,"numeric","0","");
      dtAccess.addItemRelated(index-1,"description",$(`#grade-description-${index}`).val(),"string","0","");
      dtAccess.addItemRelated(index-1,"quota",$(`#grade-quota-${index}`).val(),"numeric","0","");
      dtAccess.addItemRelated(index-1,"reg_fee",$(`#grade-reg-fee-${index}`).val().replace(",",""),"numeric","0","");
      dtAccess.addItemRelated(index-1,"course_fee",$(`#grade-course-fee-${index}`).val().replace(",",""),"numeric","0","");
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
    case 'grade':
      tableName = "course-grading"
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