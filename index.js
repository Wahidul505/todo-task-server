const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5efr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    client.connect();
    const taskCollection = client.db('todo_task').collection('tasks');
    console.log('connected')

    try {
        app.post('/task', async (req, res) => {
            const taskInfo = req.body;
            console.log(taskInfo)
            const result = await taskCollection.insertOne(taskInfo);
            res.send(result);
        });

        app.get('/task/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const task = await taskCollection.find(query).toArray();
            res.send(task);
        });

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    completed: true,
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        });


    }
    finally { }
}

run().catch(console.dir());

app.get('/', (req, res) => {
    res.send('hello');
})


app.listen(port, () => console.log('listening to', port));