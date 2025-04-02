import express from "express";
import { like,  login,  user } from "../controllers/userController.js";
import {
  getLikedUsers,
  getLikedYouUsers,
  getMatchedUsers,
  getUser,
  getUsers,
} from "../controllers/getUserController.js";
const router = express.Router();

router.post("/user", user);
router.get("/getuser", getUser);
router.get("/getusers", getUsers);
router.post("/login", login);
router.post("/like", like);
router.get("/getlikedusers", getLikedUsers);
router.get("/getlikedyouusers", getLikedYouUsers);
router.get("/getmatchedusers", getMatchedUsers);

export default router;
