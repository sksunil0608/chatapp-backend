"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexView = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // load the env variables
const baseUrl = process.env.BASE_URL;
const getIndexView = (req, res) => {
    try {
        res.redirect(`${baseUrl}`);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getIndexView = getIndexView;
