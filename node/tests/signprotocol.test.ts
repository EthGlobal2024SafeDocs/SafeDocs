import { IndexService } from "@ethsign/sp-sdk";
import {
  bytesToHex,
  Hex,
  hexToBytes,
  stringToBytes,
  stringToHex,
  toBytes,
  toHex
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import { Proxy } from "../src/lib";
import { connectToDatabase } from "../src/services/database.services";
import { CreateSchema } from "../src/services/sign-protocol";
import { DocumentTypes } from "../src/operations/documents/types";

describe("sign protocol schemas", () => {
  beforeAll(() => {
    dotenv.config();
    connectToDatabase();
  });
  it("query schema", async () => {
    const pk = Proxy.private_key_from_bytes(
      Proxy.from_hex(process.env.SIGN_WALLET_PK)
    );

    // console.log(pk.length)

    const account = privateKeyToAccount(toHex(pk.to_bytes()));

    console.log('address:', account.address)

    const indexService = new IndexService("testnet");
    const schemas = await indexService.querySchemaList({
      registrant: account.address,
      page: 1
    });

    console.log(schemas);

    // https://testnet-scan.sign.global/schema/onchain_evm_80002_0x19
    
  });

  it("create schema if missing", async () => {
    // const schema = await CreateSchema(DocumentTypes.DriversLicense);
    // console.log(schema)
  });
});
