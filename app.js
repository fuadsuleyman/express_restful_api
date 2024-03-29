const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const MONGODB_URI = process.env.MONGO_DB_URI;

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

// express 4.16-dan asagi versiyalarda body-parser istifade olunur 
// app.use(bodyParser.json());

// file upload
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// express 4.16-dan yuxari versiyalarda body-parser istifade olunmur
app.use(express.json());
// images papkasini istifade etmek ucun
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(multer({storage:fileStorage, fileFilter: fileFilter}).single('image'));

// bu asagidaki form-dan data cekende lazimdi
// app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data})
})

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

mongoose.connect(
    MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
    )
    .then(result => {
        const server = app.listen(process.env.PORT || 8080);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
          console.log('Client connected');
        });
      })
      .catch(err => console.log(err));
    // .then(result => {
    //    const server = app.listen(8080);
    //    const io = require('socket.io')(server);
    //    io.on('connection', socket => {
    //        console.log('Client connected');
    //    })
    // })
    // .catch(err => console.log(err))

    
    