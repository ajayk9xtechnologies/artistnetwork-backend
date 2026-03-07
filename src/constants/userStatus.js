// ─── Account status (User.status) ─────────────────────────────────────────
// Who can login and use the app. Same for artist and organisation.
// PENDING → first successful login sets ACTIVE. SUSPENDED/DEACTIVATED cannot login.
const ACCOUNT_STATUS = {
    PENDING: 0,   // just registered; can login; first login → ACTIVE
    ACTIVE: 1,    // normal; can use the platform
    SUSPENDED: 2, // blocked (login rejected)
    DEACTIVATED: 3, // closed (login rejected)
};

// ─── Online status (User.lastSeenAt) ───────────────────────────────────────
// "Is the user on the site right now?" Updated on every auth request.
// Consider online if lastSeenAt is within this many ms.
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

// ─── KYC status (User.kycStatus) ───────────────────────────────────────────
// Both artist and organisation use this. Same flow; you can later restrict
// features (e.g. bookings, verified badge) until KYC is APPROVED.
const KYC_STATUS = {
    NOT_SUBMITTED: 0,
    PENDING: 1,    // under review
    APPROVED: 2,
    REJECTED: 3,
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
    CAD: "CAD",
    AUD: "AUD",
    NZD: "NZD",
    CHF: "CHF",
    JPY: "JPY",
    CNY: "CNY",
    HKD: "HKD",
    SGD: "SGD",
    SEK: "SEK",
    NOK: "NOK",
    DKK: "DKK",
    PLN: "PLN",
    CZK: "CZK",
    HUF: "HUF",
    RUB: "RUB",
    TRY: "TRY",
    BRL: "BRL",
    MXN: "MXN",
    COP: "COP",
    PHP: "PHP",
    THB: "THB",
    MYR: "MYR",
    IDR: "IDR",
    VND: "VND",
    KRW: "KRW",
    TWD: "TWD",
};
 
module.exports = { ACCOUNT_STATUS, KYC_STATUS, TRAVEL_PREFERENCE, PREFERRED_WORKING_HOURS, CURRENCY, ONLINE_THRESHOLD_MS };