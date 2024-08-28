import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  DataLocationOnChain
} from "@ethsign/sp-sdk";
import { Hex, stringToHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ObjectId } from "mongodb";

export const ShareDocument = async (
  ownerAddress: `0x${string}`,
  documentId: string,
  proxyKey: string,
  validUntil: number,
  recipient: string
) => {
  // create the attestation of sign protocol to share the document

  const privateKey: Hex = stringToHex(process.env.SIGN_WALLET_PK!);

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey) // Optional, depending on environment
  });

  const attestation = await client.createAttestation({
    schemaId: "0x16",
    data: {
      documentId,
      proxyKey
    },
    attester: ownerAddress,
    validUntil: validUntil,
    indexingValue: recipient,
    recipients: [recipient],
    dataLocation: DataLocationOnChain.ONCHAIN
  });

  return attestation;
};
