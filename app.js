const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// express 4.16-dan asagi versiyalarda body-parser istifade olunur 
// app.use(bodyParser.json());

// express 4.16-dan yuxari versiyalarda body-parser istifade olunmur
app.use(express.json());

// bu asagidaki form-dan data cekende lazimdi
// app.use(express.urlencoded({ extended: true }));

const testApiRoutes = require('./routes/test_api');

app.use('/api', testApiRoutes);

app.listen(8080);