const NotificationData = {
    WELCOME: 'WELCOME',
    POPULAR: 'POPULAR',
    VIEWS: 'VIEWS',
    APPLY: 'APPLY',
    POSTED: 'POSTED',
};
  
const THRESHOLD_VIEWS = 50;
const THRESHOLD_APPLY = 60;
const THRESHOLD_POSTED = 4;
  
const getEmailNotifType = (scrapedProduct, currentProduct) => {
    
    if(scrapedJob.jobViewsValue > THRESHOLD_VIEWS) {
        NotificationData.VIEWS as keyof typeof NotificationData;
    }
    if(scrapedJob.jobAppliedValue > THRESHOLD_APPLY) {
        NotificationData.APPLY as keyof typeof NotificationData;
    }
    if(scrapedJob.jobPostedValue < THRESHOLD_POSTED) {
        NotificationData.POSTED as keyof typeof NotificationData;
    }

    return null;
};

module.exports = {getEmailNotifType};