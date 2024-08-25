const { MongoClient } = require('mongodb');

async function main() {
    const connectionURI = process.env.DB_CONN_STRING;

    const client = new MongoClient(connectionURI);

    try {
        await client.connect();

        const result = await client.db(process.env.DB_NAME).collection("wallets")
    } catch (e) {

    }
}