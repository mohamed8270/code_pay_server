const JobModel = require('../../models/job.model');
const connectToDB = require('../../mongoose');
const scrapeJobData =  require('../scraper');
const {generateEmailBody, sendMail} = require('../nodemailer/index');


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
        );

        
    } catch (error) {
        console.log(`Failed to create or update product: ${error.message}`);
    }
}

const addUserEmailToJobs =  async (jobId, userEmail) => {
    try {
        const job = await JobModel.findById(jobId);
        if(!job) return;

        const userExists = job.users.some((user) => user.email === userEmail);
        if(!userExists) {
            job.users.push({email: userEmail});
            await job.save();
            const emailContent = await generateEmailBody(job, "WELCOME");
            await sendMail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.log(`Error while sending mail ${error.message}`);
    }
}

module.exports = {
    scrapeAndStoreJobData,
    addUserEmailToJobs,
};