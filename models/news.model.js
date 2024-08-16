const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    source: {
        id: {type: String},
        name: {type: String},
    },
    author: {type: String},
    title: {type: String},
    description: {type: String},
    url: {type: String},
    urlToImage: {type: String},
    publishedAt: {type: String},
    content: {type: String},
    default: [],
},
{timestamps: true},
);

const NewsModel = mongoose.models.NewsModel || mongoose.model('NewsModel', newsSchema);

module.exports = NewsModel;