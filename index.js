const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewares

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.cn37c5v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("bistroDb").collection("user");
    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewCollection = client.db("bistroDb").collection("reviews");
    const cartCollection = client.db("bistroDb").collection("carts");


    // user related apis
    app.post('/users',async(req,res)=>{
      const user  = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);

    })
    // menu related apis
    app.get('/menu',async(req,res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    app.get('/review',async(req,res)=>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })
    // carts collection apis

    app.get('/carts',async(req,res)=>{
      const email = req.query.email;
      if(!email){
        return ([])
      }
        const query = { email: email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
     
    })

    app.post('/carts',async(req,res)=>{
      const item = req.body;
      console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    app.delete('/carts/:id',async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('bistro boss running');
})

app.listen(port,()=>{
    console.log(`bistro boss is running of ${port}`);
})
