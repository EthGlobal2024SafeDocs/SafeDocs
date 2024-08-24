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
        name: "SafeDocs Access Pass",
        data: [
          { name: "documentId", type: "string" },
          { name: "tkey", type: "string" },
        ],
      });
    
    console.log(res);
}

createSchema()