pragma solidity >= 0.5.0 < 0.6.0;

contract House {

    struct house {
        bytes32 houseName;
        bytes32 houseNo;
        bytes32 street;
        bytes32 city;
        bytes32 inputHash;
    }

    mapping(bytes32 => house) houseList;
    mapping(bytes32 => string) tx_hashes;
    bytes32[] houseHashes;

    constructor() public {
    }

    function createHouse (
        bytes32 house_name,
        bytes32 house_no,
        bytes32 street,
        bytes32 city_name)

        public
        {
            bytes32 houseHash = getHash(house_name, house_no, street, city_name);
            houseList[houseHash] = house(house_name, house_no, street, city_name, houseHash);
            houseHashes.push(houseHash);

    }

    function setTxHash(string memory tx_hash) public {
        bytes32 houseHash = houseHashes[houseHashes.length -1];
        tx_hashes[houseHash] = tx_hash;
    }

    function getAllHouseHashes() public view returns( bytes32[] memory) {
        return houseHashes;
    }

    function getHouseByHash( bytes32 house_hash )
    public
    view
    returns(
        bytes32 house_name,
        bytes32 house_no,
        bytes32 street,
        bytes32 city_name,
        bytes32 inputHash

    ) {
        house memory h = houseList[house_hash];
        return (h.houseName, h.houseNo, h.street, h.city, h.inputHash);
    }

    function getTxHash(bytes32 house_hash) public view returns(string memory) {
        return tx_hashes[house_hash];
    }

    function getHash(
        bytes32 house_name,
        bytes32 house_no,
        bytes32 street,
        bytes32 city_name)

        private
        pure
        returns(bytes32) {
            string memory dataStr = new string(
                house_name.length +
                house_no.length +
                street.length +
                city_name.length );

            bytes memory byteStr = bytes(dataStr);


            uint j = 0;
        uint i;
        for(i = 0; i < house_name.length; i++){
            byteStr[j++] = house_name[i];
        }
        for(i = 0; i < house_no.length; i++){
            byteStr[j++] = house_no[i];
        }
        for(i = 0; i < street.length; i++){
            byteStr[j++] = street[i];
        }
        for(i = 0; i < city_name.length; i++){
            byteStr[j++] = city_name[i];
        }

        return keccak256(byteStr);
    }
}