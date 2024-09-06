require('dotenv').config()

console.log("Creating Schema");

const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");

// Set up Wallet
const privateKey = process.env.PRIVATE_KEY_1;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.polygonAmoy,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

// Create Schema
const createSchema = async () => {
  const res = await client.createSchema({
    name: "SignCast Access Pass With Hook",
    hook: "0x652883aE6705E24d51a23471fF345bE557CEe1f0",
    data: [
      {
        "name": "escrowId",
        "type": "uint256"
      },
      {
        "name": "contentCreator",
        "type": "address"
      },
      {
        "name": "subscriber",
        "type": "address"
      },
      {
        "name": "documentId",
        "type": "uint256"
      },
      {
        "name": "transformationKey",
        "type": "bytes"
      }
    ]
  });

  console.log(res);
}

createSchema()