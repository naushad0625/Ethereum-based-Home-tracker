const OwnershipManagement = artifacts.require("OwnershipManagement");

module.exports = function (deployer) {
  deployer.deploy(OwnershipManagement);
};
