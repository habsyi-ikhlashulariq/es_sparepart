$(document).ready(function() {
    $('#list-object').DataTable({
        'dom': 'Bfrtip',
        'processing': true,
        'serverSide': true,
        'serverPaging': true,
        'ajax': {
            'url' : '/api/general/' + _OBJECT_NAME + '/0/datatable',
            'data' : {
                'orderBy' : _ORDER_BY
            }
        },
        'columns': COLOUMN_SETTINGS,
        'language': {
            'decimal': ',',
            'thousands': '.'
        },
        buttons: []
    });
})

function editObject(objectId, objectName, objectType) {
    window.location = app_url + 'app/' + objectType + '/' + objectName + '/' + objectId
}

function deleteObject (objectId, objectName, objectType) {
    //
}