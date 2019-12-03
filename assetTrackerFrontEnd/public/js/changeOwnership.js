$(document).ready(function () {

    let form = $('#form');
    let houseTxHash = $('#house_tx_hash');
    let newOwnersName = $('#new_owners_name');
    let newOwnersAddress = $('#new_owners_address');
    let changeOwnerSubmit = $('#change_owner_submit');
    let currentOwnersAddress = $('#current_owners_address');

    changeOwnerSubmit.click(function (e) {
        console.log('Clicked!!!');
        e.preventDefault();
        let house_tx_hash = houseTxHash.val();
        let new_owners_name = newOwnersName.val();
        let new_owners_address = newOwnersAddress.val();
        let current_owners_address = currentOwnersAddress.val();

        let data = {
            house_tx_hash: house_tx_hash,
            new_owners_name: new_owners_name,
            new_owners_address: new_owners_address,
            current_owners_address: current_owners_address,
        }

        if (house_tx_hash && new_owners_address && new_owners_name && current_owners_address) {
            let url = `http://localhost:59311/changeOwner`
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function (response) {
                    console.log(response);
                    form.trigger("reset");
                    $('.alert').show();
                }
            });
        }
    });

    $('.alert').on('closed.bs.alert', function () {
        location.reload();
    })
});