const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 4000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvlwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
   try{
        await client.connect();
        console.log('connect to database')

        const database = client.db('CarMechanic');
        const serviceCollection = database.collection('Service');

        // POST API 
        app.post('/services', async(req, res) => {
            const service = req.body
            console.log('hit the post api', service)
            

            const result = await serviceCollection.insertOne(service);
            console.log(result)
            res.send(result)

        })

        // GET API 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // GET SINGLE SERVICES 
        app.get('/services/:id', async (req, res) => {
            
          const id = req.params.id;
          console.log('hit id', id)
           const query = {_id: ObjectId(id)};

           const service = await serviceCollection.findOne(query);
            res.json(service)
        })

        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            console.log('delete', id)
            const result = await serviceCollection.deleteOne(query);
            res.json(result)  
        })
   }

   finally{
    //    await client.close();
   }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running Genius Server')
})



app.listen(port, () => {
    console.log('Running Genius Server on port', port)
})


// user: GeniusUser
// pass : YtBhuexLcm4NwSdL