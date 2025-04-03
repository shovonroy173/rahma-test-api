import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.js";
import Message from "./models/Message.js";
import ChatSession from "./models/ChatSession.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database!"))
  .catch(() => "Not Connected to Database!");

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use("/api", userRouter);

app.use((err, req, res, next) => {
  console.log("LINE AT  21 INDEX", err);
  const errorStatus = err.status || 500;
  const errorStack = err.stack;
  const errorMessage = err.message || "Something broke!!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: errorStack,
  });
});

app.listen(5000, () => {
  try {
    console.log("Connected to Server!");
  } catch (error) {
    console.log(error);
  }
});
const sendPendingMessages = async (userId) => {
  try {
    const pendingMessages = await Message.find({
      receiverId: userId,
      delivered: false,
    });

    if (pendingMessages.length > 0) {
      const receiverSocketId = userSocketMap[userId];

      if (receiverSocketId) {
        pendingMessages.forEach(async (msg) => {
          io.to(receiverSocketId).emit("receiveMessage", {
            senderId: msg.senderId,
            message: msg.message,
          });

          // Mark as delivered
          await Message.findByIdAndUpdate(msg._id, { delivered: true });
        });

        console.log(
          `Sent ${pendingMessages.length} pending messages to user ${userId}`
        );
      }
    }
  } catch (error) {
    console.error("Error sending pending messages:", error);
  }
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(socket.id);

  const userId = socket.handshake.query.userId;
  console.log(userId);

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
    sendPendingMessages(userId);
  }

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        delivered: false,
      });
      await newMessage.save();

      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId,
          message,
        });
        // Mark message as delivered
        await Message.findByIdAndUpdate(newMessage._id, { delivered: true });
      } else {
        console.log("Receiver is offline, message saved to DB.");
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete userSocketMap[userId];
  });
});

app.post("/api/sendMessage", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      delivered: false, // Initially set to false, indicating the message is not delivered yet
    });

    await newMessage.save();

    const senderMessages = await Message.find({ senderId, receiverId });
    const receiverMessages = await Message.find({
      senderId: receiverId,
      receiverId: senderId,
    });

    if (senderMessages.length > 0 && receiverMessages.length > 0) {
      // Update the chat session status to 'active'
      await ChatSession.findOneAndUpdate(
        { participants: { $all: [senderId, receiverId] } },
        { status: "active" }
        // { upsert: true } // Ensures the session is created if not found
      );
    } else {
      // Check if a ChatSession already exists
      let chatSession = await ChatSession.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      // If no session exists, create a new one with 'request' status
      if (!chatSession) {
        chatSession = new ChatSession({
          participants: [senderId, receiverId],
          status: "request",
        });
        await chatSession.save();
      }
    }
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
      });

      await Message.findByIdAndUpdate(newMessage._id, { delivered: true });

      console.log("Message delivered to the receiver in real-time.");
    } else {
      console.log(
        "Receiver is offline. Message saved to DB and will be sent when they come online."
      );
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("ERROR in sending message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the message." });
  }
});

app.get("/api/getMessages", async (req, res) => {
  try {
    const messages = await Message.find(req.body.userId);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
});

server.listen(3000, () => {
  console.log("Server" + 3000);
});
