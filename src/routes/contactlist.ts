// contactlist.ts
import { Router } from "express";
import { getContactList, postAddContact, getVerifyVChatUser } from "../controllers/contactlist";
import authenticate from "../middleware/authentication";

const router = Router();

router.get("/contacts", authenticate, getContactList);
router.post("/contacts/add", authenticate, postAddContact);
router.post('/verify-vchat-user', authenticate, getVerifyVChatUser);

export default router;
