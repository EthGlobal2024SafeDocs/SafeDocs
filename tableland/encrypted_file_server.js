const express = require('express');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'documentsDB';
const collectionName = 'uploads';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Upload file to S3 and store in MongoDB
app.post('/upload', async (req, res) => {
    const filePath = req.body.filePath;
    const absoluteFilePath = path.resolve(filePath);
    const documentId = uuidv4();
    const fileName = path.basename(absoluteFilePath);

    const bucketName = 's3://encrypted';
    const s3Key = `${documentId}-${fileName}`;
    const command = `aws s3 cp ${absoluteFilePath} ${bucketName}/${s3Key}`;

    exec(command, async (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error uploading file: ${stderr}`);
        }

        const s3Url = `http://localhost:8014/${s3Key}`;

        try {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const document = {
                documentId: documentId,
                fileName: fileName,
                s3Url: s3Url,
                uploadedAt: new Date()
            };

            await collection.insertOne(document);

            res.json({
                message: 'File uploaded successfully',
                documentId: documentId,
                s3Url: s3Url
            });
        } catch (dbError) {
            res.status(500).send('Error storing document in MongoDB');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectToMongo();
});
