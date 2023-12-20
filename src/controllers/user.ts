import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";


config(); // load the env variables
const baseUrl = process.env.BASE_URL!;
function isInValidString(str: string) {
  return str === undefined || str.length === 0 ? true : false;
}
export const getLoginView = (req: Request, res: Response) => {
  try {
    res.redirect(`${baseUrl}/login`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateAccessToken = (id: number, name: string) => {
  const tokenPayload = {
    userId: id,
    name: name,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, { expiresIn: "1800s" });
  return token;
};


export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email: user_email, password: user_pass } = req.body;

    if (isInValidString(user_email) || isInValidString(user_pass)) {
      return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" });
    }
    // Existing User Validation
    const existingUser = await User.findOne({ where: { email: user_email } });

    if (!existingUser) {
      return res.status(404).json({ err: "User not registered! Please Signup" });
    }

    const passwordMatch = await bcrypt.compare(user_pass, existingUser.password);

    if (passwordMatch) {
      return res.status(200).json({
        success: "Successful Login",
        token: generateAccessToken(existingUser.id, existingUser.fname),
      });
    } else {
      return res.status(401).json({ error: "Authentication Error! Password Does Not Match." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSignupView = (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postSignup = async (req: Request, res: Response) => {
  try {
    const {
      fname: first_name,
      lname: last_name,
      email: user_email,
      phone: user_phone,
      password: user_pass,
      confirm_password: cnf_user_pass,
    } = req.body;

    if (
      isInValidString(first_name) ||
      isInValidString(last_name) ||
      isInValidString(user_email) ||
      isInValidString(user_phone) ||
      isInValidString(user_pass) ||
      isInValidString(cnf_user_pass) ||
      user_pass !== cnf_user_pass
    ) {
      return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" });
    }

    // Existing User Validation
    const existingUser = await User.findOne({ where: { email: user_email } });

    if (!existingUser) {
      const salt_rounds = 10;
      const hash = await bcrypt.hash(user_pass, salt_rounds);

      await User.create({
        fname: first_name,
        lname: last_name,
        email: user_email,
        phone: user_phone,
        password: hash,
      });

      return res.status(201).json({ success: "User Created Successfully" });
    } else {
      return res.status(409).json({ error: "User Already Exist" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
