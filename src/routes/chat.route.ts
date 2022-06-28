import express from "express";
import {
  postChatMessages,
  getAudio,
  getSpeechMarks,
} from "../controllers/chat.controller";
const router = express.Router();

router.post("/", postChatMessages);
router.get("/test-polly", getAudio);
router.get("/test-speech", getSpeechMarks);

export default router;
