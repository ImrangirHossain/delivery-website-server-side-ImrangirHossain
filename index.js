const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fniyp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('hitting the post')
        const database = client.db('delivery');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // get api
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
         })
        app.get('/orders', async(req, res)=>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
         })

        //  GET SINGLE SERVICES 
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('getting single service', id)
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })
       
        //  GET SINGLE ORDER 
        app.get('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('getting single service', id)
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })
       
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        
         // Add Orders API 
         app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // DELETE API

        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('deleting user with id ', result);
            res.json(result);
        })
        

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('my  server are running')
})

app.listen(port, () => {
    console.log('Running  Server on port', port);
})