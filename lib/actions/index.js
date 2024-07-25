const connectToDB = require('../../mongoose');
const scrapeJobData =  require('../scraper');
const JobModel = require('../../models/job.model');

const scrapeAndStoreJobData = async (joburl) => {
    if(!joburl) return true;

    try {
        connectToDB();
        const scrapedJobData = await scrapeJobData(joburl);

        if(!scrapedJobData) return;

        let jobData = scrapedJobData;

        const existingJob = await JobModel.findOne({url: scrapedJobData.url});

        if(existingJob) {
            const updatedpostedHistory = [
                ...existingJob.postedHistory,
                {posted: scrapedJobData.jobPostedValue},
                
            ]

            const updatedappliedHistory = [
                ...existingJob.appliedHistory,
                {apply: scrapedJobData.jobAppliedValue},
            ]

            const updatedviewsHistory = [
                ...existingJob.viewsHistory,
                {views: scrapedJobData.jobViewsValue},
            ]

            const postedDiff = scrapedJobData.jobPostedValue - existingJob.jobPostedValue;
            const appliedDiff = scrapedJobData.jobAppliedValue - existingJob.jobAppliedValue;
            const viewDiff = scrapedJobData.jobViewsValue - existingJob.jobViewsValue;

            jobData = {
                ...scrapedJobData,
                postedHistory: updatedpostedHistory,
                appliedHistory: updatedappliedHistory,
                viewsHistory: updatedviewsHistory,
                jobPostedValue: existingJob.jobPostedValue + postedDiff,
                jobAppliedValue: existingJob.jobAppliedValue + appliedDiff,
                jobViewsValue: existingJob.jobViewsValue + viewDiff,
            }
        }

        const newJobData = await JobModel.findOneAndUpdate(
            {url: scrapedJobData.url},
            jobData,
            {upsert: true, new: true},
        )

        
    } catch (error) {
        console.log(`Failed to create or update product: ${error.message}`);
    }
}

module.exports = {scrapeAndStoreJobData};