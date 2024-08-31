import { SignProtocolClient, SpMode, EvmChains, DataLocationOnChain, IndexService } from '@ethsign/sp-sdk';
import { Hex, stringToHex, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Proxy } from '../lib';
import { DocumentTypes } from '../operations/documents/types';
import { collections } from './database.services';
import Schema from '../models/schema';

type SchemaData = {
    type: string;
    documentId: string;
    proxy: string;
};

export const ShareDocument = async (
    ownerAddress: `0x${string}`,
    documentType: DocumentTypes,
    documentId: string,
    proxyKey: string,
    validUntil: number,
    recipient: string
) => {
    // create the attestation of sign protocol to share the document

    // get the schema for the document
    const schema = await collections.schemas?.findOne<Schema>({
        document_type: documentType,
    });

    if (!schema) {
        throw new Error(`No Schema defined for document type: ${documentType}`);
    }

    const client = SignClient();

    const attestation = await client.createAttestation({
        schemaId: schema.schema_id,
        data: {
            document_id: documentId,
            proxy: proxyKey,
        },
        attester: ownerAddress,
        validUntil: validUntil,
        indexingValue: recipient,
        recipients: [recipient],
        dataLocation: DataLocationOnChain.ONCHAIN,
    });

    return attestation;
};

export const CreateSchema = async (type: DocumentTypes) => {
    // check our db first.
    const eSchema = await collections.schemas?.findOne<Schema>({
        document_type: type,
    });

    if (eSchema) {
        // exists.. return
        return eSchema;
    }

    // create schema if not exists for type
    const account = GetPlatformAccount();

    // query schema for account
    const indexService = new IndexService('testnet');
    const schemas = await indexService.querySchemaList({
        registrant: account.address,
        page: 1,
    });

    if (schemas.rows.length > 0) {
        // check if any of them match the type
        schemas.rows.forEach(async (e) => {
            if (e.name == DocumentTypes.DriversLicense) {
                // we have a schema in sign protocol.. create a document internally
                return await createSchemaDocument({
                    schema_id: e.id,
                    document_type: type,
                    txHash: e.transactionHash,
                });
            }
        });
    }

    // no matching schema exists in sign protocol.. create a new one
    const client = SignClient();
    const schema = await client.createSchema({
        name: type.toString(),
        description: 'Safe Docs Demo',
        data: [
            { name: 'document_id', type: 'string' },
            { name: 'proxy', type: 'string' },
        ],
    });

    return createSchemaDocument({
        schema_id: schema.schemaId,
        document_type: type,
        txHash: schema.txHash,
    });
};

const GetPlatformAccount = () => {
    const pk = Proxy.private_key_from_bytes(Proxy.from_hex(process.env.SIGN_WALLET_PK));

    return privateKeyToAccount(toHex(pk.to_bytes()));
};

const SignClient = () => {
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.polygonAmoy,
        account: GetPlatformAccount(),
    });

    return client;
};

const createSchemaDocument = async (schema: Schema) => {
    const r = await collections.schemas?.insertOne(schema);
    return { ...schema, _id: r?.insertedId } as Schema;
};

export const GetAttestation = async (attestation_id: string) => {
    const pk = Proxy.private_key_from_bytes(Proxy.from_hex(process.env.SIGN_WALLET_PK));

    const account = privateKeyToAccount(toHex(pk.to_bytes()));

    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.polygonAmoy,
        account,
    });

    const attestation = await client.getAttestation(attestation_id);

    return attestation;
};
