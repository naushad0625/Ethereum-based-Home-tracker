pragma solidity >= 0.5.0 < 0.6.0;

contract OwnershipManagement {

    struct Owner {
        bytes32 owners_name;
        address owners_address;
    }
    mapping(bytes32 => Owner) ownerInfo;
    mapping(bytes32 => bytes32) txHashes;

    function addOwnership(bytes32 house_tx_hash, bytes32 name) public {
        ownerInfo[house_tx_hash] = Owner(name, msg.sender);
    }

    function changeOwnership(bytes32 house_tx_hash, bytes32 new_owners_name, address new_owners_addrss) public {
        require(ownerInfo[house_tx_hash].owners_address == msg.sender, 'Owner is not changing ownership');
        ownerInfo[house_tx_hash] = Owner(new_owners_name, new_owners_addrss);
    }

    function setOwnershipTxHash(bytes32 house_tx_hash, bytes32 ownership_tx_hash) public {
        txHashes[house_tx_hash] = ownership_tx_hash;
    }

    function getOwnersInfo(bytes32 house_tx_hash) public view returns (bytes32, address) {
        return (
            ownerInfo[house_tx_hash].owners_name,
            ownerInfo[house_tx_hash].owners_address
        );
    }

    function getOwnershipTransactionInfo(bytes32 house_tx_hash) public view returns(bytes32) {
        return txHashes[house_tx_hash];
    }
}