const ACCOUNT_STATUS = {
    PENDING: 0, // just registered / not fully verified yet.
    ACTIVE: 1, // normal user, can use the platform.
    SUSPENDED: 2, // temporarily blocked (maybe for review, payment issues, abuse).
    DEACTIVATED: 3, // permanently closed account (by user or admin).
};

// understnd use kycStatus 
const KYC_STATUS = {
    NOT_SUBMITTED: 0, // not submitted yet
    PENDING: 1, // pending review
    APPROVED: 2, // approved
    REJECTED: 3, // rejected
};
const TRAVEL_PREFERENCE = {
    LOCAL_ONLY: 0, // local only
    LOCAL_AND_NATIONAL: 1, // local and national
    NATIONAL_AND_INTERNATIONAL: 2, // national and international
    INTERNATIONAL_ONLY: 3, // international only
};
const PREFERRED_WORKING_HOURS = {
    MORNING: "morning",
    EVENING: "evening",
    NIGHT: "night",
    FLEXIBLE: "flexible",
};

const CURRENCY = {
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP",
    INR: "INR",
};
 
module.exports = { ACCOUNT_STATUS, KYC_STATUS, TRAVEL_PREFERENCE, PREFERRED_WORKING_HOURS, CURRENCY };