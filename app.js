const { MongoClient } = require('mongodb');

// Replace <username>, <password>, <cluster-address>, and <database> with your MongoDB Atlas credentials and cluster info
const uri = "mongodb+srv://tvu8:YSK9BoMrMQ5MpyIr@cluster0.utboj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Initialize MongoDB client
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB Atlas cluster
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");

    // Access a specific database and collection (change 'example' to your collection name)
    const database = client.db("sample_mflix"); // Replace <database> with your actual database name
    const collection = database.collection("comments"); // Replace 'example' with your actual collection name

    // Insert a document if the collection is empty (for testing purposes)
    const insertResult = await collection.insertOne({ name: "Test Document", createdAt: new Date() });
    console.log("Inserted document with _id:", insertResult.insertedId);

    // Find a document in the collection
    const document = await collection.findOne({}); // Adjust the query as needed
    if (document) {
      console.log("Found document:", document);
    } else {
      console.log("No documents found.");
    }

  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the function and catch any errors
run().catch(console.error);
