const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const testApiRoutes = require('./routes/test_api');

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


app.use('/api', testApiRoutes);

app.listen(8080);