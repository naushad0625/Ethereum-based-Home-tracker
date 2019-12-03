$(document).ready(function () {

    let submitBtn = $('#submit');
    let txHashInput = $('#tx_hash_input');
    let txSearchOutput = $('#tx_search_output');


    submitBtn.click(function (e) {
        e.preventDefault();
        let tx_hash = txHashInput.val();

        if (tx_hash) {
            url = `http://localhost:59311/owner/${tx_hash}`;
            console.log(url);

            $.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    console.log(response);
                    $('#owners_name').val(response[0]);
                    $('#owners_address').val(response[1]);
                }
            });
        }

    });

});