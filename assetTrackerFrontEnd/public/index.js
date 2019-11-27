$(document).ready(function () {
    let form = $('#form');
    let submitBtn = $('#submit');
    let formCancel = $('#cancel');
    let houseInfoTable = $('#house_info');

    let txSearch = $('#tx_search');
    let txSearchInput = $('#tx_search_input');
    let txSearchOutput = $('#tx_search_output');

    let txInputSubmit = $('#tx_input_submit');
    let txDataTextArea = $('#tx_data_text_area');

    $.ajax({
        type: "GET",
        url: "http://localhost:59311/",
        success: function (response) {
            console.log(response);
            houseInfoTable.DataTable({
                data: response,
                "columnDefs": [
                    { "width": "10%", "targets": 0 },
                    { "width": "30%", "targets": 1 },
                    { "width": "20%", "targets": 2 },
                    { "width": "20%", "targets": 3 },
                    { "width": "20%", "targets": 4 }
                ]
            })
        }
    });

    submitBtn.click(function (e) {
        e.preventDefault();

        let city = $('#city');
        let street = $('#street');
        let houseNo = $('#house_no');
        let houseName = $('#house_name');
        let houseWoner = $('#house_woner');

        let data = {
            city: city.val(),
            street: street.val(),
            house_no: houseNo.val(),
            house_name: houseName.val(),
            house_woner: houseWoner.val(),
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:59311/create",
            data: data,
            success: function (response) {
                console.log(response);
                location.reload();
            },
            error: function (error) {
                console.log("Error");
                console.log(error);
                
            }
        });

        
    });

    txSearch.click(function (e) { 
        e.preventDefault();
        let tx_hash = txSearchInput.val();

        if(tx_hash) {
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
                    $('#v').val(response[11]);
                    $('#r').val(response[12]);
                    $('#s').val(response[13]);
                }
            });
        }
        
    });

    txInputSubmit.click(function (e) { 
        e.preventDefault();

        let tx_input = $('#tx_input').val();

        if(tx_input) {
            let url = `http://localhost:59311/tx/${tx_input}`
            $.ajax({
                type: "GET",
                url: url,
                success: function (response) {
                    console.log(response);
                    txDataTextArea.val(JSON.stringify(response));
                }
            });
        }
        
    });
});