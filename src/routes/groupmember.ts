import { Router } from "express";
import { getGroupMembers, getUserGroups, postCreateGroupMember, postRemoveGroupMember, postMakeMemberAdmin } from "../controllers/groupmember";
import authenticate from "../middleware/authentication";

const router = Router();

router.get("/groups/:groupId/members", authenticate, getGroupMembers);
router.post('/groups/:groupId/members', authenticate, postCreateGroupMember);
router.post('/groups/:groupId/members/remove', authenticate, postRemoveGroupMember)

router.put('/groups/:groupId/members/make-admin', authenticate, postMakeMemberAdmin);
router.put('/groups/:groupId/members/remove-admin')
router.get('/user/groups', authenticate, getUserGroups)


export default router;
