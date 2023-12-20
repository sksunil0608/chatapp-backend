import { Router } from "express";
import { getGroupMessages, postCreateGroupMessage } from "../controllers/groupmessage"
import authenticate from "../middleware/authentication";
import { getGroupAttachments, uploadGroupAttachment } from "../controllers/groupfileattachment";
import multer from 'multer'
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/groups/:groupId/messages', authenticate, getGroupMessages)
router.post('/groups/:groupId/messages', authenticate, postCreateGroupMessage)

router.post('/groups/:groupId/attachments', authenticate, upload.array('attachments[]'), uploadGroupAttachment)
router.get('/groups/:groupId/attachments', authenticate, getGroupAttachments)


export default router;