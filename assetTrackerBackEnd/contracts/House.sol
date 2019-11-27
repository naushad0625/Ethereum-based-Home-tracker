pragma solidity >= 0.5.0 < 0.6.0;

contract House {
    
    uint currentHouseId;
    
    struct house {
        bytes32 houseName;
        bytes32 wonersName;
        bytes32 houseNo;
        bytes32 street;
        bytes32 city;
    }
    
    mapping(uint => house) houseList;
    mapping(uint => string) tx_hashes;
    uint[] houseIds;
    
    constructor() public {
        currentHouseId = 0;
    }
    
    function createHouse (
        bytes32 house_name,
        bytes32 woners_name,
        bytes32 house_no,
        bytes32 street,
        bytes32 city_name)
        
        public
        {
            
            currentHouseId++;
            houseList[currentHouseId] = house(house_name, woners_name, house_no, street, city_name);
            houseIds.push(currentHouseId);
        
    }

    function setTxHash(string memory tx_hash) public {
        tx_hashes[currentHouseId] = tx_hash;
    }
    
    function getAllHouseIds() public view returns( uint[] memory) {
        return houseIds;
    }
    
    function getHouseById( uint house_id )
    public
    view
    returns(
        bytes32 house_name,
        bytes32 woners_name,
        bytes32 house_no,
        bytes32 street,
        bytes32 city_name
        
    ) {
        house memory h = houseList[house_id];
        return (h.houseName, h.wonersName, h.houseNo, h.street, h.city);
    }

    function getTxHash(uint id) public view returns(string memory) {
        return tx_hashes[id];
    }
    
    function changeWoner(uint house_id, bytes32 woners_name) public {
        house storage h = houseList[house_id];
        h.wonersName = woners_name;
    }
}