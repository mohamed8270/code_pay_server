const axios = require('axios');
const NewsModel = require('../../models/news.model');
const connectToDB = require('../../mongoose');
require('dotenv').config();

const fetchNewsData = async () => {
    const newsApi = process.env.NEWS_API;
    try {
        const res = await axios.get(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${newsApi}`);
        const newsData = res.data.articles;

        connectToDB();

        for(const article of newsData) {
            const news = new NewsModel(article);
            await news.save();
        }
        

    } catch (error) {
        console.log(error);
    } 
}

module.exports = {fetchNewsData};