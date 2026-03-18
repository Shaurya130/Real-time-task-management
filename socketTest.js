import { io } from "socket.io-client";
import { logger } from "./src/utils/logger";

const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MWQxOTNjZC01MGYwLTRjZjItOTMzZS1hYjY1NGU4ZGIxZGEiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MTk1MDI5MSwiZXhwIjoxNzcxOTUxMTkxfQ.U0ndfRm_mNZXus0-1LlAPl2umSn_5r24M0XLbdamS3M";

const socket= io("http://localhost:5000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    logger.info("Client Connected");
})

socket.on("connect_error", (err) => {
  logger.error("Connection error:", err.message);
});

socket.onAny((event, data) => {
  logger.info("Event:", event, data);
});