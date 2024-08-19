const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const JobModel = require('./models/job.model');
const connectToDB = require('./mongoose');
require('dotenv').config();

//  imports
const {scrapeAndStoreJobData} = require('./lib/actions');
const scrapeJobData = require('./lib/scraper');
const {extractWhiteSpace} = require('./lib/utils/utils');
const {fetchNewsData} = require('./lib/fetch/news_fetch');

// express objects
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ports
const port = process.env.PORT;
const localhost = process.env.LOCAL_HOST;
const hosturl = `${localhost+port}`;

// post job data
app.post('/scrape/jobs', async (req, res) => {
    const joburl = req.body.url;
    try {
        // const scrapedData = await scrapeJobData(joburl);
        const scrapedData = await scrapeAndStoreJobData(joburl);
        res.status(200).json({message: 'Data scarped successfully!', 'output': scrapedData});
    } catch (error) {
        res.status(500).send({ message: "An error occurred while getting the job details", error: error.message });
    }
});

// job search functionality
app.post('/jobs/search', async (req, res) => {
    const jobsearch = req.body.data;
    try {
        const filterData = extractWhiteSpace(jobsearch);
        const fullurl = 'https://www.foundit.in/search/' + filterData;
    } catch (error) {
        res.status(500).send({ message: "An error occurred while getting the job details", error: error.message });
    }
});

// get jobs data
app.get('/get/jobs', async (req, res) => {
    try {
        connectToDB();
        const jobsdata = await JobModel.find();
        res.json(jobsdata);
    } catch (error) {
        res.status(500).send({ message: "An error occurred while getting the job details", error: error.message });
    }
});

// get jobs details using ID
app.get('/get/job/details/:id', async (req, res) => {
    try {
        connectToDB();
        const jobdetailsID = req.params.id;
        const jobsdetailsout = await JobModel.findById(jobdetailsID);
        if(!jobsdetailsout) {
            res.status(404).json({message: 'Job Details not found'});
        }
        res.json(jobsdetailsout);
    } catch (error) {
        res.status(500).send({ message: "An error occurred while getting the job details", error: error.message });
    }
});

// fetch news data
app.get('/newsdata', async (req, res) => {
    try {
        const data = fetchNewsData();
        res.status(200).json({message: data});
    } catch (error) {
        res.status(500).send({message: "An occur while fetching news data", error: error.message});
    }
});

// listener
app.listen(port, () => {
    console.log(`App running on port ${port}`);
    console.log(`Localhost url is ${hosturl}`);
});
