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
  
  
  $("#studentId").select2(select2Options({
    placeholder: '- choose type -',
    objectName: 'student'
  }));
  
  
  