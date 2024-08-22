const JobModel = require('../../models/job.model');
const {connectToDB} = require('../../mongoose');
const {generateEmailBody, sendMail} = require('../nodemailer');
const scrapeJobData = require('../scraper');
const {getEmailNotifType} = require('../utils/type');


export async function GET() {
    try {
        connectToDB();
        const jobs = await JobModel.find({});

        if(!jobs) throw new Error('Jobs not fetched');

        // =================== 1 SCRAPE LATEST JOB DATA AND UPDATE DB
        const updatedJobs = await Promise.all(
            jobs.map(async (currentJob) => {
                const scrapedJob = await scrapeJobData(currentJob.url);
                if(!scrapedJob) return;

                const updatedpostedHistory = [
                    ...currentJob.postedHistory,
                    {posted: scrapedJob.jobPostedValue},
                ]

                const updatedappliedHistory = [
                    ...currentJob.appliedHistory,
                    {apply: scrapedJob.jobAppliedValue},
                ]

                const updatedviewsHistory = [
                    ...currentJob.viewsHistory,
                    {views: scrapedJob.jobViewsValue},
                ]

                const postedDiff = scrapedJob.jobPostedValue - currentJob.jobPostedValue;
                const appliedDiff = scrapedJob.jobAppliedValue - currentJob.jobAppliedValue;
                const viewDiff = scrapedJob.jobViewsValue - currentJob.jobViewsValue;

                const jobData = {
                    ...scrapedJob,
                    postedHistory: updatedpostedHistory,
                    appliedHistory: updatedappliedHistory,
                    viewsHistory: updatedviewsHistory,
                    jobPostedValue: currentJob.jobPostedValue + postedHistory,
                    jobAppliedValue: currentJob.jobAppliedValue + appliedDiff,
                    jobViewsValue: currentJob.jobViewsValue + viewDiff,
                };

                // ======================= UPDATE THE JOB IN MONGODB
                const updatedJob = await JobModel.findOneAndUpdate(
                    {url: jobData.url},
                    jobData,
                );

                // ======================= 2 CHECK EACH JOB DATA AND SEND MAIL
                const emailNotifyType = getEmailNotifType(scrapedJob, currentJob);

                if(emailNotifyType && updatedJob.users.length > 0) {
                    const jobInfo = {
                        jobName: updatedJob.jobName,
                        url: updatedJob.url,
                    };

                    // EMAIL CONTENT
                    const emailContent = await generateEmailBody(jobInfo, emailNotifyType);
                    // GET ARRAY OF USERS EMAIL 
                    const userEmails = updatedJob.users.map((user) => user.email);
                    // SENT EMAIL NOTIFICATION
                    await sendMail(emailContent, userEmails);
                }

                return updatedJob;

            })
        );

        return res.json({message: "Ok", data: updatedJob});
        
    } catch (error) {
        throw new Error(`Mail error occured ${error}`);
    }
}


module.exports = {GET};