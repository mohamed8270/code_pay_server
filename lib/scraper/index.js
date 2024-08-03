const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

// imports
const {extractJobDataSpace, extractJobDataComma, extractCommaSeparated} = require('../utils/utils');
const {extractPostData, extractViewsData, extractAppliedData, extractJobID, extractJobIndexData} = require('../utils/scraper_extract');

const scrapeJobData = async (url) => {
    if(!url) return;

    const username = process.env.BRIGHT_DATA_USERNAME;
    const password = process.env.BRIGHT_DATA_PASSWORD;
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    }

    try {
        const response = await axios.get(url, options);
        // console.log(response);
        const $ = cheerio.load(response.data);

        const jobtitle = $('#titleSection h1').text().trim();
        console.log(jobtitle);

        const jobcompany = extractJobDataSpace($('#titleSection a'));

        const jobplace = extractJobDataSpace($('#jobHighlight a'));

        const jobexper = extractJobDataSpace($('#jobHighlight div.flex .items-center .gap-1 span.text-xs:eq(0)'));

        const jobsalary = extractJobDataSpace($('#jobHighlight div.flex .items-center .gap-1 span.text-xs:eq(1)'));

        // const jobposted = $('#jobHighlight div:eq(8) span').text().trim();
        const jobposted = extractPostData($);

        // const jobviews = $('#jobHighlight div:eq(9) span').text().trim();
        const jobviews = extractViewsData($);

        // const jobapplied = $('#jobHighlight div:eq(10) span').text().trim();
        const jobapplied = extractAppliedData($);
        
        const jobdescription = $('.break-all').text().trim();

        const jobtype = extractJobDataSpace($('#jobInfo div:eq(0) a'));

        const jobindustry = $('#jobInfo div:eq(4) a').text().trim();

        const jobfunction = extractJobDataSpace($('#jobInfo div:eq(8) a'));

        const jobrole = extractCommaSeparated($,'#jobInfo div:eq(12) a');

        const jobskillset = extractCommaSeparated($,'#jobInfo div:eq(16) a');

        const jobcompanylink = 'https://www.foundit.in' + $('#titleSection a').attr('href');

        const jobsource = $('#jobCompany a').text().trim();

        // href="https://www.foundit.in/seeker/job-apply?id=28836478&autoApply=true"
        // const jobapply = $('a').map((i, el) => $(el).attr('href')).get();
        const jobapply = extractJobID(url);

        const quickapply = 'https://www.foundit.in' + extractJobIndexData($,0);

        const jobpostednumber = Number(jobposted.replace(/\D/g,''));

        const jobviewsnumber = Number(jobviews.replace(/\D/g,''));

        const jobappliednumber = Number(jobapplied.replace(/\D/g,''));
        
        const data = {
            url,
            jobName: jobtitle,
            jobCompany: jobcompany || '',
            jobPlace: jobplace || '',
            jobExperience: jobexper || '',
            jobSalary: jobsalary || '',
            jobPosted: jobposted || '',
            jobViews: jobviews || '',
            jobApplied: jobapplied || '',
            jobDescription: jobdescription.replace(/^.*\n/, "") || '',
            jobType: jobtype || '',
            jobIndustry: jobindustry || '',
            jobFunction: jobfunction || '',
            jobRole: jobrole || [],
            jobSkillsets: jobskillset || [],
            jobCompanyUrl: jobcompanylink || '',
            jobSource: jobsource || '',
            jobApply: jobapply || '',
            jobQuickApply: quickapply || '',
            jobPostedValue: jobpostednumber || 0,
            jobAppliedValue: jobappliednumber || 0,
            jobViewsValue: jobviewsnumber || 0,
            postedHistory: [],
            appliedHistory: [],
            viewsHistory: [],
        };

        console.log(data);

        return data;

    } catch (error) {
        throw new Error(`Scraper error ${error.message}`);
    }
};

module.exports = scrapeJobData;

