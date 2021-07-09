const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const feedRoutes = require('./routes/feed');

const MONGODB_URI =
'mongodb+srv://fuads:wLoyopyig03cXY9a@cluster0.oepjk.mongodb.net/feedDB?retryWrites=true&w=majority'

// express 4.16-dan asagi versiyalarda body-parser istifade olunur 
// app.use(bodyParser.json());

// express 4.16-dan yuxari versiyalarda body-parser istifade olunmur
app.use(express.json());

// bu asagidaki form-dan data cekende lazimdi
// app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})


app.use('/feed', feedRoutes);

mongoose.connect(
    MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err))

