const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middelwares
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER_EMA}:${process.env.DB_PASSWORD_EMA}@cluster0.exe7q4w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const productCollection = client.db('emaJohn').collection('products');

        app.get('/products', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products })
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

    }
    finally {

    }

}
run().catch(err => console.log(err))


// ------
app.get('/', (req, res) => {
    res.send('genius car server is runing')
});
app.listen(port, () => {
    console.log(`genius car server on ${port}`)
})
