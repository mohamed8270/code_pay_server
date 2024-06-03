const nodemailer = require('nodemailer');
const fse = require('fs-extra')
require('dotenv').config();

// notification type
const Notification = {
    WELCOME: 'WELCOME',
};


const readHTMLContent = async () => {
    const htmlFilePath = 'lib/nodemailer/html_content/welcome_email.html'; // Replace with actual path

    await fse.readFile(htmlFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
    });

    return data;
}

// mail type accordian
const generateEmailBody = async (job, type) => {

    // shortened title
    const shortenedTitle = job.jobName.length > 20 ? `${job.jobName.subString(0,20)}` : job.jobName;

    // read HTML content
    const htmlRead = await readHTMLContent();

    let htmlContent = htmlRead; // Declare outside the callback

    // subject and title
    let subject = '';
    let body = htmlContent;

    // switch case to generate body and sub
    switch (type) {
        case Notification.WELCOME:
            subject = `Welcome to Code Pay 💰 for ${shortenedTitle}`;
            body = ``;
            break;
    
        default:
            throw new Error("Invalid notification type.");
    }

    return {subject, body};
},

// mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'businesscovai.ats@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1,
});

// mail sending
const sendMail = async (emailContent, sendTo) => {

    // mail options
    const mailOptions = {
        from: 'businesscovai.ats@gmail.com',
        to: sendTo,
        html: emailContent.body,
        subject: emailContent.subject,
    },

    // transporter mail
    transporter.sendMail(mailOptions ,(error, info) => {
        if(error) return console.log(error);
        console.log('Email sent:', info);
    }),
},

module.exports = {
    generateEmailBody,
    sendMail,
};