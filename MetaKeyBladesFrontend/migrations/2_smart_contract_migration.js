const SmartContract = artifacts.require("MetaKeyBlades");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "MetaKey Blades", "MKB", "https://");
};
