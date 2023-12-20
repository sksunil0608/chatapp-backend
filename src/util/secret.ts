import { randomBytes } from "crypto";
// Generate a random string to use as the secret key
const secretKey = randomBytes(64).toString("hex");
console.log(secretKey)