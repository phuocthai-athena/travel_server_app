// Libs
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Models
import User from "../models/User.js";

// Constants
import { MESSAGE_RESPONSES, STATUS_RESPONSES } from "../utils/constants.js";

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(STATUS_RESPONSES.BAD_REQUEST).json({
      message: errors.array(),
    });
  }

  try {
    // Check exists user
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res
        .status(STATUS_RESPONSES.BAD_REQUEST)
        .json({ message: MESSAGE_RESPONSES.USER_ALREADY });
    }

    user = new User(req.body);
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(STATUS_RESPONSES.SUCCESSFUL).json({
      success: true,
      message: MESSAGE_RESPONSES.SUCCESSFUL,
    });
  } catch (err) {
    return res.status(STATUS_RESPONSES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE_RESPONSES.SOMETHING_WRONG,
    });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(STATUS_RESPONSES.BAD_REQUEST).json({
      message: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(STATUS_RESPONSES.BAD_REQUEST).json({
        message: MESSAGE_RESPONSES.INVALID_CREDENTITALS,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(STATUS_RESPONSES.BAD_REQUEST).json({
        message: MESSAGE_RESPONSES.INVALID_CREDENTITALS,
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(STATUS_RESPONSES.SUCCESSFUL).json({ userId: user.id });
  } catch (error) {
    return res.status(STATUS_RESPONSES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE_RESPONSES.SOMETHING_WRONG,
    });
  }
};
