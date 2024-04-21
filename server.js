const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;




const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.static(__dirname));
app.use(express.json()); // Middleware for parsing JSON

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    console.log('Received order:', order);

    // Connect to MongoDB
    await client.connect();

    // Get a reference to the orders collection
    const ordersCollection = client.db('d1').collection('orders');

    // Insert the order into the MongoDB collection
    const result = await ordersCollection.insertOne(order);

    // Respond with a success message
    res.status(200).json({ message: 'Order received successfully', orderId: result.insertedId });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);

    // Attempt to close the MongoDB connection if it was partially established
    try {
      await client.close();
      console.log('MongoDB connection closed.');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}

startServer();
