const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// voletierNetwork
// HkTvKsHRTDZsd7hO

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcbcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const serviceCollection = client.db("velentierservice").collection('service')
        const volentierCollection = client.db("velentier").collection('user')
        const eventCollection = client.db("eventPost").collection('event')


        // all service    http://localhost:5000/service
        // search api     http://localhost:5000/service?name=Host cloth shop
        app.get("/service",async (req,res)=>{
            const q = req.query
            const cursor = serviceCollection.find(q)
            const result = await cursor.toArray()
            res.send(result)
        })


        // volentier post api    http://localhost:5000/volentier
        app.post('/volentier',async(req,res)=>{
            const volentier = req.body;
            const result = await volentierCollection.insertOne(volentier)
            res.send(result)
        })

        // volentier get api  http://localhost:5000/volentier
        app.get('/volentier',async(req,res)=>{
            const query ={}
            const cursor = volentierCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        
    // delete volentier  http://localhost:5000/volentier/6267d15377f4478976bf8ae9

        app.delete('/volentier/:id',async(req,res)=>{
            const id = req.params.id
            const filterId = {_id:ObjectId(id)}
            const result = await  volentierCollection.deleteOne(filterId)
            res.send(result)

        })


        // event data
        // event post     http://localhost:5000/event
        app.post('/event',async(req,res)=>{
            const event = req.body
            const result = await eventCollection.insertOne(event)
            res.send(result)
        })

        // event data     http://localhost:5000/event
        app.get('/event',async(req,res)=>{
            const query = {}
            const cursor = eventCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // delete api    http://localhost:5000/event/6267d7ffec9b169261c3227e
        app.delete("/event/:id",async(req,res)=>{
            const id = req.params.id
            const filterId = {_id:ObjectId(id)}
            const result = await eventCollection.deleteOne(filterId)
            res.send(result)

        })

}
    finally{}
}

run().catch(console.dir)



app.get('/',(req,res)=>{
    res.send("hello express")
})

app.listen(port,()=>{
    console.log("volentier running",port);
})