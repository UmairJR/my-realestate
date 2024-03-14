// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Escrow is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _propIds;
    address public inspector;
     
    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    struct Property{
        uint propertyId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        address payable buyer;
        bool sold;
        // Price propertyPrice;
        Property_info propertyInfo;
    }
    struct Property_info {
        bool isListed;
        bool isInspected;
        bool finalApproval;
    }
    // struct Price {
    //     uint purchasePrice;
    //     uint depositAmount;
    //     uint totalAmount;
    // }
    mapping(uint => Property) public props;

    event Offered (
        uint propId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint propId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor( address _inspector ) {
        inspector = _inspector;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        _propIds.increment();
        uint256 currPropId = _propIds.current();
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new property to Property mapping
        props[currPropId] = Property (
            currPropId, //propertyId
            _nft, //nft address
            _tokenId, //nft Id
            _price,
            payable(msg.sender), //seller
            payable(address(0)), //buyer
            false, //sold
            // Price(_purchasePrice, _depositPrice, _purchasePrice+_depositPrice), // purchasePrice, depositPrice, totalPrice
            Property_info(false, false, false) // isListed, isInspected, isApproved
        );
        //emit event
        emit Offered(
            currPropId,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function nftTransferToContract(uint _propId, uint _newPrice) external nonReentrant {
        require(_newPrice > 0, "Price must be greater than zero");
        require(_propId > 0 && _propId <= _propIds.current(), "Item does not exist");
        Property storage prop = props[_propId];
        require(prop.nft.ownerOf(prop.tokenId) == address(msg.sender), "You does not own the NFT");
        IERC721 nft = prop.nft;
        prop.price = _newPrice;
        // transfer nft
        nft.transferFrom(msg.sender, address(this), prop.tokenId);
        resetDetails(_propId, false, false);
        //call listProperty() after this fucntion in frontend 
    }

    function listProperty(uint _propId) external nonReentrant{
        require(_propId > 0 && _propId <= _propIds.current(), "Item does not exist");
        Property storage prop = props[_propId];
        require(!prop.propertyInfo.isListed, "Already Listed");
        prop.propertyInfo.isListed = true;
        prop.sold = false;
    }

    function getItemCount() public view returns (uint256) {
        return _propIds.current();
    }

    // Put Under Contract (only buyer - payable escrow)
    // function depositEarnest(uint256 _nftID) public payable nonReentrant(_nftID) {
    //     require(msg.value >= escrowAmount[_nftID]);
    // }

    function paymentEscrow(uint256 _propId) external payable nonReentrant {
        Property storage prop = props[_propId];
        require(msg.value >= prop.price);
        prop.buyer = payable(msg.sender);
    }

    // Update Inspection Status (only inspector)
    function updateInspectionStatus(uint256 _propId, bool _passed)
        public
        onlyInspector
    {
        Property storage prop = props[_propId];
        prop.propertyInfo.isInspected = _passed;
    }

    // Approve Sale
    function approveSale(uint256 _propId) public {
        Property storage prop = props[_propId];
        prop.propertyInfo.finalApproval = true;
    }

    // Finalize Sale
    // -> Require inspection status (add more items here, like appraisal)
    // -> Require sale to be authorized
    // -> Require funds to be correct amount
    // -> Transfer NFT to buyer
    // -> Transfer Funds to Seller
    function finalizeSale(uint256 _propId) external nonReentrant {
        Property storage prop = props[_propId];
        require(prop.nft.ownerOf(prop.tokenId) == address(this), "Contract does not own the NFT");
        require(prop.propertyInfo.isInspected);
        require(prop.propertyInfo.finalApproval);
        require(!prop.sold, "Already sold");
        require(address(this).balance >= prop.price);

        // prop.propertyInfo.isListed = false;
        // transfer payment to the seller
        bool success = payable(prop.seller).send(prop.price);
        if(success) {
            // transfer the NFT to the buyer
            IERC721 nft = prop.nft;
            nft.transferFrom(address(this), address(prop.buyer), prop.tokenId);
            emit Bought(_propId, address(prop.nft), prop.tokenId, prop.price, prop.seller, prop.buyer);
            prop.seller = payable(prop.buyer);
            resetDetails(_propId, false, true); // _propId, _shouldList, _sold
        } 
        else {
            payable(prop.buyer).transfer(prop.price);
            resetDetails(_propId, true, false); // _propId, _shouldList, _sold
            revert("Failed to transfer funds to the seller");
        }
    }

    // Cancel Sale (handle earnest deposit)
    // -> if inspection status is not approved, then refund, otherwise send to seller
    function cancelSale(uint256 _propId) public {
        require(_propId > 0 && _propId <= _propIds.current(), "Item does not exist");
        Property storage prop = props[_propId];
        prop.propertyInfo.isInspected = false;
        require(prop.propertyInfo.isInspected == false);
        payable(prop.buyer).transfer(prop.price);
    }

    function resetDetails(uint256 _propId, bool _shouldList, bool _sold) public {
        require(_propId > 0 && _propId <= _propIds.current(), "Item does not exist");
        Property storage prop = props[_propId];
        prop.buyer = payable(address(0));
        prop.sold = _sold;
        prop.propertyInfo.isListed = _shouldList;
        prop.propertyInfo.isInspected = false;
        prop.propertyInfo.finalApproval = false;
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}