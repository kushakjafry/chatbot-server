import express from "express";
import cors from "cors";
import chatRouter from "./src/routes/chat.route";

(async function () {
  const server = express();
  const PORT = 4000;
  server.use(cors());
  server.use(express.json());
  server.use("/api/chat", chatRouter);
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
})();
