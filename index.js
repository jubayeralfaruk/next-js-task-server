const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());
// 629UtoeMxwMLrWNM

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzgjhab.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("next_js_task_db");
    const productCollection = db.collection("product");

    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.senderEmail = email;
      }
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(product);
    });

    app.post("/products", async (req, res) => {
      const parcel = req.body;
      const result = await productCollection.insertOne(parcel);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // PATCH (update) a product by id
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updates = req.body;
      const result = await productCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("Next.js server is starting");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
