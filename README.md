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
