// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {
    mapping(string => string) private hashKeys;

    function storeHashKey(string memory _hashKey) public {
        require(bytes(hashKeys[_hashKey]).length == 0, "Already Exist");
        hashKeys[_hashKey] = _hashKey;
    }

    function isStored(string memory _hashKey) public view returns (bool) {
        return bytes(hashKeys[_hashKey]).length > 0;
    }
}