import { Request, Response } from "express";
import { config } from "dotenv";

config(); // load the env variables
const baseUrl = process.env.BASE_URL!;


export const getIndexView = (req: Request, res: Response) => {
    try {
        res.redirect(`${baseUrl}`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};