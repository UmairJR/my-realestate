const inspector_address = "0x291291710b387F0d7209Cb4149d1fD6AD7Ce2018";
const Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
    deployer.deploy(Escrow, inspector_address);
};