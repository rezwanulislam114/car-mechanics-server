const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middle ware
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://car-mechanics:xbJXOo6wovibecET@cluster0.tdrs3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })

        // find single api 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(quary)
            res.send(service);
        })

        // find api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(quary);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('this is working')
})

app.listen(port, () => {
    console.log('runnig genius server from ', port)
})