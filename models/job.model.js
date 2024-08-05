const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    url: {type: String, required: true, unique: true},
    jobName: {type: String, required: true},
    jobCompany: {type: String, required: false},
    jobPlace: {type: String, required: false},
    jobExperience: {type: String, required: false},
    jobSalary: {type: String, required: false},
    jobPosted: {type: String, required: false},
    jobViews: {type: String, required: false},
    jobApplied: {type: String, required: false},
    jobDescription: {type: String, required: true},
    jobType: {type: String, required: false},
    jobIndustry: {type: String, required: false},
    jobFunction: {type: String, required: false},
    jobRole: [{type: String, required: false}],
    jobSkillsets: [{type: String, required: false}],
    jobCompanyUrl: {type: String, required: false},
    jobSource: {type: String, required: false},
    jobApply: {type: String, required: true},
    jobQuickApply: {type: String, required: false},
    jobPostedValue: {type: Number, required: false},
    jobAppliedValue: {type: Number, required: false},
    jobViewsValue: {type: Number, required: false},
    postedHistory: [
        {
            posted: {type: Number, required: true},
            Date: {type: Date, default: Date.now},
        }
    ],
    appliedHistory: [
        {
            apply: {type: Number, required: true},
            Date: {type: Date, default: Date.now},
        }
    ],
    viewsHistory: [
        {
            views: {type: Number, required: true},
            Date: {type: Date, default: Date.now},
        }
    ],
    users: [
        {
            email: {type: String, required: true},
        },
    ], default: [],
},
{timestamps: true},
);

const JobModel = mongoose.models.JobModel || mongoose.model('JobModel', jobSchema);

module.exports = JobModel;