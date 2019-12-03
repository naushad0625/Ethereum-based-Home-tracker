$(document).ready(function () {

    let houseTxHash = $('#house_tx_hash');
    let ownershipTxHash = $('#ownership_tx_hash');

    let dataHouseTxHash = $('#data_house_tx_hash');
    let dataOwnershipTxHash = $('#data_ownership_tx_hash');

    let submitHouseTxHash = $('#submit_house_tx_hash');
    let submitOwnershipTxHash = $('#submit_ownership_tx_hash');

    submitHouseTxHash.click(function (e) {
        e.preventDefault();

        let tx_hash = houseTxHash.val();

        if (tx_hash) {
            let url = `http://localhost:59311/tx/${tx_hash}`;
            $.ajax({
                type: "GET",
                url: url,
                success: function (response) {
                    dataHouseTxHash.val(JSON.stringify(response));
                }
            });

        }

    });

    submitOwnershipTxHash.click(function (e) {
        e.preventDefault();

        let tx_hash = ownershipTxHash.val();
        console.log(tx_hash);

        if (tx_hash) {
            let url = `http://localhost:59311/owner/tx/${tx_hash}`;
            $.ajax({
                type: "GET",
                url: url,
                success: function (response) {
                    console.log(response);
                    dataOwnershipTxHash.val(JSON.stringify(response));
                }
            });
        }
    })

});