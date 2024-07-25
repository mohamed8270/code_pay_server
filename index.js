const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//  imports
const {scrapeAndStoreJobData} = require('./lib/actions');
const scrapeJobData = require('./lib/scraper');
const {extractWhiteSpace} = require('./lib/utils/utils');
const JobModel = require('./models/job.model');
const connectToDB = require('./mongoose');


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




('/scrape/jobs', async (req, res) => {
    const joburl = req.body.url;
    // const joburl = `https://www.foundit.in/job/fflutter-developer-radial-hr-solutions-bengaluru-bangalore-remote-23378163?searchId=326009df-0a1a-46e3-8a12-696e275f1505`;
    // const joburl = `https://www.foundit.in/job/flutter-developer-techknowledgehuborg-remote-india-28836478?searchId=49b7dc8a-46ba-4b26-bed8-276e103066e3`;
    try {
        // const scrapedData = await scrapeJobData(joburl);
        const scrapedData = await scrapeAndStoreJobData(joburl);
        res.json({message: 'Data scarped successfully!', 'output': scrapedData});
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

// listener
app.listen(port, () => {
    console.log(`App running on port ${port}`);
    console.log(`Localhost url is ${hosturl}`);
});
