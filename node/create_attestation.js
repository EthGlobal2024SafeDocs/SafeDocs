require('dotenv').config()
console.log("Creating Attestation");

const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");

// Set up Wallet
const privateKey = process.env.PRIVATE_KEY_1;
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.polygonAmoy,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

// Create attestation

const attest = async ({
  documentId,
  tkey,
  validUntil,  
  recipient
}) => {
    const res = await client.createAttestation({
        schemaId: "0x16",
        data: { 
            documentId: documentId, 
            tkey: tkey
        },
        validUntil: validUntil,
        indexingValue: recipient,
        recipients: [recipient],
        dataLocation: "onchain"
      });
    console.log(res);
    
  }

attest({
    documentId: "abc",
    tkey: "cidthi",
    validUntil: Math.floor(Date.now() / 1000) + 300,    
    recipient: process.env.PUBLIC_KEY_2
})