$(document).ready(function () {

    let txSearch = $('#tx_search');
    let txSearchInput = $('#tx_search_input');
    let txSearchOutput = $('#tx_search_output');


    txSearch.click(function (e) {
        e.preventDefault();
        let tx_hash = txSearchInput.val();

        if (tx_hash) {
            url = `http://localhost:59311/${tx_hash}`;
            console.log(url);

            $.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    console.log(response);
                    $('#hash').val(response[0]);
                    $('#nonce').val(response[1]);
                    $('#blockHash').val(response[2]);
                    $('#blockNumber').val(response[3]);
                    $('#transactionIndex').val(response[4]);
                    $('#from').val(response[5]);
                    $('#to').val(response[6]);
                    $('#value').val(response[7]);
                    $('#gas').val(response[8]);
                    $('#gasPrice').val(response[9]);
                    $('#input').val(response[10]);
                }
            });
        }

    });

});