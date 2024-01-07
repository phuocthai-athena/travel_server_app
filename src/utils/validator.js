import { check } from "express-validator";

export const validatorRegister = [
  check("first_name", "First name is required.").isString(),
  check("last_name", "Last name is required.").isString(),
  check("email", "Email is required.").isEmail(),
  check("password", "Password with 8 or more characters required.").isLength({
    min: 8,
  }),
];

export const validatorLogin = [
  check("email", "Email is required.").isEmail(),
  check("password", "Password with 8 or more characters required.").isLength({
    min: 8,
  }),
];
