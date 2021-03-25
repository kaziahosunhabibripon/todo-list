const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

const password = 'Ripon4236';

const uri = "mongodb+srv://todolistdb:Ripon4236@cluster0.xz7nx.mongodb.net/todolist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();
app.use(express.json());
app.use (express.urlencoded({ extended: false }));





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



client.connect(err => {
    const workCollection = client.db("todolist").collection("worktodo");

    app.get('/works', (req, res)=>{
        workCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        });

    })

    app.get('/works/:id', (req, res)=>{
        workCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })

    })
    app.post('/addWork', (req, res)=>{
        const work = req.body; 
        workCollection.insertOne(work)
        .then(result=>{   
            res.redirect('/');
        })     
    })

    app.patch('/update/:id', (req, res)=>{
        workCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set:{Time: req.body.time, Number: req.body.number}
        })
        .then(result=>{
            res.send(result.modifiedCount > 0);
        })

    })

    app.delete('/delete/:id', (req, res)=>{
        workCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result=>{
            res.send(result.deletedCount >0 );
        })
       

    })

    console.log(err);

});

app.listen(8000, () => console.log("Listening on port 8000"));