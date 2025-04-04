import express from "express";
import { like, login, user } from "../controllers/userController.js";
import {
  getLikedUsers,
  getLikedYouUsers,
  getMatchedUsers,
  getUser,
  getUsers,
} from "../controllers/getUserController.js";
import {
  acceptRequest,
  getActiveConversation,
  getActives,
  getLastMessage,
  getRequestConversation,
  getRequests,
  sendRequest,
} from "../controllers/messageController.js";
const router = express.Router();

router.post("/user", user);
router.get("/getuser", getUser);
router.get("/getusers", getUsers);
router.post("/login", login);
router.post("/like", like);
router.get("/getlikedusers", getLikedUsers);
router.get("/getlikedyouusers", getLikedYouUsers);
router.get("/getmatchedusers", getMatchedUsers);
router.get("/getactiveconversation", getActiveConversation);
router.get("/getlastmessage", getLastMessage);
router.get("/getrequestconversation", getRequestConversation);

router.post("/acceptrequest", acceptRequest);
router.post("/sendrequest", sendRequest);
router.get("/getrequests", getRequests);
router.get("/getactives", getActives);

export default router;
