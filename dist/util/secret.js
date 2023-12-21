"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
// Generate a random string to use as the secret key
const secretKey = (0, crypto_1.randomBytes)(64).toString("hex");
console.log(secretKey);
