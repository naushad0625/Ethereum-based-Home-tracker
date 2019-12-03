$(document).ready(function () {
    let form = $('#form');
    let submitBtn = $('#submit');
    let formCancel = $('#cancel');
    let houseInfoTable = $('#house_info');


    submitBtn.click(function (e) {
        e.preventDefault();

        let city = $('#city');
        let street = $('#street');
        let houseNo = $('#house_no');
        let houseName = $('#house_name');
        let houseOwner = $('#house_owner');

        let data = {
            city: city.val(),
            street: street.val(),
            house_no: houseNo.val(),
            house_name: houseName.val(),
            house_owner: houseOwner.val(),
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:59311/create",
            data: data,
            success: function (response) {
                console.log(response);
                form.trigger("reset");
                location.reload();
            },
            error: function (error) {
                console.log("Error");
                console.log(error);

            }
        });


    });

});