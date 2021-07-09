const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    }
},
    { timestamps: true } // bu avtomatic deyisiklik zamani createdAt verir
);

module.exports = mongoose.model('Post', postSchema);