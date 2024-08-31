require('dotenv').config()
const { decodeAbiParameters } = require("viem");
const { SignProtocolClient, SpMode, EvmChains, IndexService } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");

// Set up Wallet
const privateKey = process.env.PRIVATE_KEY_1;
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

const schemaId = "onchain_evm_80002_0x16";
const serviceType = "testnet";

// Retrieve all attestations by recipient
// Bob wants to see all the attestations that he has received.
const fetchAttestationByRecipient = async ({
    page,
    recipient
}) => {
    console.log("Fetching Attestation by Recipient");
    console.log(recipient);

    const indexService = new IndexService(serviceType);
    const res = await indexService.queryAttestationList({
        schemaId: schemaId,
        page: page,
        indexingValue: recipient,
    });

    return {
        ...res,
        rows: await transformDataArray(res.rows)
    }

}


// Retrieve all attestations by attester
// Alice wants to see all the attestations that she has issued.
const fetchAttestationByAttester = async ({
    page,
    attester
}) => {
    console.log("Fetching Attestation by Attester");
    console.log(attester);

    const indexService = new IndexService(serviceType);
    const res = await indexService.queryAttestationList({
        schemaId: schemaId,
        page: page,
        attester: attester,
    });

    return {
        ...res,
        rows: await transformDataArray(res.rows)
    }
}


// The data field in the attestation object is encoded in ABI format.
// This function decodes the data field using viem's decodeAbiParameters() function.
const transformDataArray = async (attestationList) => {
    return await Promise.all(
        attestationList.map(
            async (att) => {
                return await decodeData(att);
            }
        )
    );
}

const decodeData = async (att) => {
    if (!att.data) return att;
    const data = decodeAbiParameters(
        att.schema.data,
        att.data
    );
    return {
        ...att,
        data,
    };
}

// Test the functions
fetchAttestationByRecipient({
    recipient: process.env.PUBLIC_KEY_2,
    page: 1
})

fetchAttestationByAttester({
    attester: process.env.PUBLIC_KEY_1,
    page: 1
})

// Example Output:
// {
//     total: 3,
//     rows: [
//       {
//         id: 'onchain_evm_80002_0xe',
//         mode: 'onchain',
//         chainType: 'evm',
//         chainId: '80002',
//         attestationId: '0xe',
//         transactionHash: '0xa2c585856a5445feecdfa4ac20b99e73f652f21bd91729bcf35e6798f60d3c7b',
//         indexingValue: '0xa8D4b2388c7E37745C5dB36df20cFb4482AF61f2',
//         schemaId: '0x16',
//         fullSchemaId: 'onchain_evm_80002_0x16',
//         linkedAttestation: '',
//         attester: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         from: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         attestTimestamp: '1724474597000',
//         validUntil: '1724474890',
//         revoked: false,
//         revokeTimestamp: null,
//         revokeReason: null,
//         revokeTransactionHash: '',
//         data: '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003616263000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066369647468690000000000000000000000000000000000000000000000000000',
//         dataLocation: 'onchain',
//         extra: {},
//         syncAt: '1724474599669',
//         lastSyncAt: null,
//         recipients: [Array],
//         schema: [Object]
//       },
//       {
//         id: 'onchain_evm_80002_0xd',
//         mode: 'onchain',
//         chainType: 'evm',
//         chainId: '80002',
//         attestationId: '0xd',
//         transactionHash: '0x3e7cad3a1e4a33427f18a2b5d8b41237be7a801210af4a5ac55b34d8da0c67ca',
//         indexingValue: '0xa8D4b2388c7E37745C5dB36df20cFb4482AF61f2',
//         schemaId: '0x16',
//         fullSchemaId: 'onchain_evm_80002_0x16',
//         linkedAttestation: '',
//         attester: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         from: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         attestTimestamp: '1724473999000',
//         validUntil: '1724472482',
//         revoked: false,
//         revokeTimestamp: null,
//         revokeReason: null,
//         revokeTransactionHash: '',
//         data: '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003616263000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066369647468690000000000000000000000000000000000000000000000000000',
//         dataLocation: 'onchain',
//         extra: {},
//         syncAt: '1724474006401',
//         lastSyncAt: null,
//         recipients: [Array],
//         schema: [Object]
//       },
//       {
//         id: 'onchain_evm_80002_0xa',
//         mode: 'onchain',
//         chainType: 'evm',
//         chainId: '80002',
//         attestationId: '0xa',
//         transactionHash: '0x3600d1e9243b814b5034770c29a439b37311db3a7dfbb3fd29207f711ed93b88',
//         indexingValue: '0xa8D4b2388c7E37745C5dB36df20cFb4482AF61f2',
//         schemaId: '0x16',
//         fullSchemaId: 'onchain_evm_80002_0x16',
//         linkedAttestation: '',
//         attester: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         from: '0x1e4aA086D5f8A172cd8f1a7EC6a3BdEF035E280a',
//         attestTimestamp: '1724472247000',
//         validUntil: '1724472482',
//         revoked: false,
//         revokeTimestamp: null,
//         revokeReason: null,
//         revokeTransactionHash: '',
//         data: '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003616263000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066369647468690000000000000000000000000000000000000000000000000000',
//         dataLocation: 'onchain',
//         extra: {},
//         syncAt: '1724472253775',
//         lastSyncAt: null,
//         recipients: [Array],
//         schema: [Object]
//       }
//     ],
//     size: 100,
//     page: 1
//   }