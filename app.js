const express = require('express');

const app = express();

const testApiRoutes = require('./routes/test_api');

app.use('/api', testApiRoutes);

app.listen(8080);