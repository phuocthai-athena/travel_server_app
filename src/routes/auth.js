// Libs
import express from "express";

// Controllers
import { register } from "../controllers/authController.js";

// Utils
import { validatorLogin, validatorRegister } from "../utils/validator.js";

const router = express.Router();

router.post("/register", validatorRegister, register);

router.post("/login", validatorLogin);

export default router;
