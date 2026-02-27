const express = require("express");
const { authController } = require("../controllers");
const { validateRequest } = require("../middleware");
const { authValidations } = require("../validations");
const router = express.Router();
 
// normal code 
// router.get('/register',async (req, res)=>{
//     try {
//         res.status(200).json({ message: "Hello World" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// using controller

//if{} pathname , thn middleware if middleware failed then controller will not call, if middleware passed then controller will call,
router.post('/register',validateRequest(authValidations.registerSchema),authController.register);
router.post('/login-with-password',validateRequest(authValidations.loginSchema),authController.loginWithPassword);


module.exports = router;