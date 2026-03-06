<!-- backend/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  ├─ env.js
│  │  ├─ db.js
│  │  ├─ cors.js
│  │  └─ constants.js
│  ├─ routes/
│  │  ├─ index.js
│  │  ├─ auth.routes.js
│  │  ├─ artist.routes.js
│  │  ├─ org.routes.js
│  │  ├─ offer.routes.js
│  │  ├─ request.routes.js
│  │  ├─ chat.routes.js
│  │  └─ admin.routes.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ artist.controller.js
│  │  ├─ org.controller.js
│  │  ├─ offer.controller.js
│  │  ├─ request.controller.js
│  │  ├─ chat.controller.js
│  │  └─ admin.controller.js
│  ├─ services/
│  │  ├─ auth.service.js
│  │  ├─ artist.service.js
│  │  ├─ org.service.js
│  │  ├─ offer.service.js
│  │  ├─ request.service.js
│  │  ├─ chat.service.js
│  │  ├─ kyc.service.js
│  │  ├─ media.service.js
│  │  └─ notification.service.js
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ ArtistProfile.js
│  │  ├─ OrganisationProfile.js
│  │  ├─ KycDocument.js
│  │  ├─ HiringRequest.js
│  │  ├─ Offer.js
│  │  ├─ Conversation.js
│  │  └─ Message.js
│  ├─ middleware/
│  │  ├─ auth.middleware.js
│  │  ├─ role.middleware.js
│  │  ├─ validate.middleware.js
│  │  ├─ error.middleware.js
│  │  ├─ rateLimit.middleware.js
│  │  └─ upload.middleware.js
│  ├─ validators/
│  │  ├─ auth.schema.js
│  │  ├─ artist.schema.js
│  │  ├─ org.schema.js
│  │  ├─ offer.schema.js
│  │  └─ request.schema.js
│  ├─ utils/
│  │  ├─ ApiError.js
│  │  ├─ ApiResponse.js
│  │  ├─ asyncHandler.js
│  │  ├─ pick.js
│  │  ├─ pagination.js
│  │  └─ logger.js
│  ├─ libs/
│  │  ├─ jwt.js
│  │  ├─ bcrypt.js
│  │  ├─ mailer.js
│  │  ├─ storage.js   (S3/Cloudinary)
│  │  └─ socket.js
│  └─ jobs/
│     └─ cron.js (optional)
├─ .env
├─ package.json
└─ README.md -->

<!-- 
when they login whoever artist or org , the after login we have to shwot he stepper form , with 1st required fomr , then they can skip , with but hey can see recommented with profile percentage but for ord after login they must need to fill thise right . -->


<!-- 
role === "artist" and ArtistProfile is missing, OR
role === "organisation" and OrganisationProfile is missing** - Then: redirect user to /onboarding where you show the **stepper**.If profile already exists → go straight to dashboard.---## 

2. Artist onboarding stepper### 
Step 1 – **Required core info** (no skip)Use your artistProfileValidation core fields (the ones that are required):- firstName - lastName - categories (min 1) - skills (min 1) - country - cityUX:- User **must fill** these to continue/save. - Button: **“Save & continue”** (disabled until valid). - No “Skip” on this step.Backend:- POST /profile/artist with Joi validation (these fields required). - Save ArtistProfile document.### 
Step 2 – **Optional enhancements**Fields like:- bio, profilePhoto, languages, experienceYears, expectedRate, currency, photos, videos, availableDates, preferredWorkingHours, socialLinks, etc.UX:- Show all of them in 1 or 2 steps. - Top of page: **Profile 30% complete** etc. - Buttons: - **“Save”** - **“Skip for now”** (they can continue to dashboard even with everything empty).Backend:- Same POST /profile/artist endpoint; all these fields **optional** in Joi. - Completion % is computed when returning data from /fetch-user.---## 

3. Organisation onboarding stepperHere you can (and should) be a bit stricter, but same pattern.### 

Step 1 – **Required business basics** (no skip)Examples:- organisationName - country, city, maybe address - contactEmail, contactPhone - organisationType (restaurant/bar/hotel/event co.)UX:- Just like artist Step 1: **must fill** to proceed. - No skip on this step.Backend:- POST /profile/organisation with Joi schema where only these are required. - Save OrganisationProfile.### 
Step 2 – **Optional details** (profile %)Examples:- Description - Logo & cover image - Gallery photos - Social links - Venue capacity - Preferred artist categoriesStepper behavior:- Can skip, but show profile completion bar.### 
Step 3 – **KYC (can be required before certain actions)**You don’t have to do KYC in the same stepper, but you can:- Either include as Step 3 (with “Upload trade license/KYC”), or - Have a separate KYC screen that is required **before**: - Posting first gig, - Confirming a booking, - Receiving payouts.Professional approach:- **Don’t block them from exploring the app** after Step 1. - **Do block critical actions** (e.g. “Post a request” button shows: “Complete KYC to post your first request”).---## 4. Short answer to your question> “so okay so when they login whoever artist or org, after login we show stepper, first required form, then they can skip, recommended with profile percentage, but for org after login they must need to fill those right?”- **Yes**, this is a good UX: - **Step 1**: required core fields for both roles (no skip). - **Next steps**: optional, skippable, but show profile percentage and recommendations. - For **orgs**, you can make **Step 1 a bit stricter** (more required fields) and later require KYC before key actions.From backend side:- Keep required only for **core fields** in your Joi schemas. - Call those profile endpoints **after login** (onboarding), not during /register. -->