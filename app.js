const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const MONGODB_URI =
'mongodb+srv://fuads:wLoyopyig03cXY9a@cluster0.oepjk.mongodb.net/feedDB?retryWrites=true&w=majority'

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
    res.status(status).json({message: message})
})

mongoose.connect(
    MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err))

