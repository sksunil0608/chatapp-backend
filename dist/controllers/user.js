"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSignup = exports.getSignupView = exports.postLogin = exports.getLoginView = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)(); // load the env variables
const baseUrl = process.env.BASE_URL;
function isInValidString(str) {
    return str === undefined || str.length === 0 ? true : false;
}
const getLoginView = (req, res) => {
    try {
        res.redirect(`${baseUrl}/login`);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getLoginView = getLoginView;
const generateAccessToken = (id, name) => {
    const tokenPayload = {
        userId: id,
        name: name,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: "1800s" });
    return token;
};
const postLogin = async (req, res) => {
    try {
        const { email: user_email, password: user_pass } = req.body;
        if (isInValidString(user_email) || isInValidString(user_pass)) {
            return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" });
        }
        // Existing User Validation
        const existingUser = await user_1.default.findOne({ where: { email: user_email } });
        if (!existingUser) {
            return res.status(404).json({ err: "User not registered! Please Signup" });
        }
        const passwordMatch = await bcrypt_1.default.compare(user_pass, existingUser.password);
        if (passwordMatch) {
            return res.status(200).json({
                success: "Successful Login",
                token: generateAccessToken(existingUser.id, existingUser.fname),
            });
        }
        else {
            return res.status(401).json({ error: "Authentication Error! Password Does Not Match." });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.postLogin = postLogin;
const getSignupView = (req, res) => {
    try {
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getSignupView = getSignupView;
const postSignup = async (req, res) => {
    try {
        const { fname: first_name, lname: last_name, email: user_email, phone: user_phone, password: user_pass, confirm_password: cnf_user_pass, } = req.body;
        if (isInValidString(first_name) ||
            isInValidString(last_name) ||
            isInValidString(user_email) ||
            isInValidString(user_phone) ||
            isInValidString(user_pass) ||
            isInValidString(cnf_user_pass) ||
            user_pass !== cnf_user_pass) {
            return res.status(400).json({ err: "Bad Parameters, Please fill details carefully" });
        }
        // Existing User Validation
        const existingUser = await user_1.default.findOne({ where: { email: user_email } });
        if (!existingUser) {
            const salt_rounds = 10;
            const hash = await bcrypt_1.default.hash(user_pass, salt_rounds);
            await user_1.default.create({
                fname: first_name,
                lname: last_name,
                email: user_email,
                phone: user_phone,
                password: hash,
            });
            return res.status(201).json({ success: "User Created Successfully" });
        }
        else {
            return res.status(409).json({ error: "User Already Exist" });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.postSignup = postSignup;
