$(document).ready(function () {

    let houseInfoTable = $('#house_info');

    $.ajax({
        type: "GET",
        url: "http://localhost:59311/",
        success: function (response) {
            console.log(response);
            houseInfoTable.DataTable({
                data: response,
            })
        }
    });

});