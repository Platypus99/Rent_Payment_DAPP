// const Migrations = artifacts.require("Migrations");
const Migrations = artifacts.require("Rent_payment");
module.exports = function(deployer) {
  deployer.deploy(Migrations, "0x3604D4d315E877640DBe7B07163376769301A10f", 3);
};
