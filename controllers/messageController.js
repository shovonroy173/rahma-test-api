import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";

export const getActiveConversation = async (req, res, next) => {
  try {
    // Find chat sessions where receiverId matches the logged-in user and status is 'request'
    const sessions = await ChatSession.find({
      $or:[
        {
          "participants.senderId": req.query.id,

        }, 
        {
          "participants.receiverId": req.query.id,
        },
      ],
      status: "active",
    });

    console.log("Request chat session", sessions);

    if (sessions?.length <= 0) {
      return res.status(400).json({ message: "No request conversation found" });
    } else {
      // Extract senderIds from the sessions (since we know receiverId is the logged-in user)
      const receiverIds = sessions.map((session) => session.participants[0]?.receiverId || session.participants[1]?.receiverId);

      // Fetch users with the extracted receiverIds
      const users = await Profile.find({
        _id: { $in: receiverIds },
      });

      res.status(200).json(users);
      console.log(users);
    }
  } catch (error) {
    console.error("Error finding chat sessions:", error);
    next(error);
  }
};

export const getRequestConversation = async (req, res, next) => {
  try {
    // Find chat sessions where receiverId matches the logged-in user and status is 'request'
    const sessions = await ChatSession.find({
      "participants.receiverId": req.query.id,
      status: "request",
    });

    console.log("Request chat session", sessions);

    if (sessions?.length <= 0) {
      return res.status(400).json({ message: "No request conversation found" });
    } else {
      // Extract senderIds from the sessions (since we know receiverId is the logged-in user)
      const senderIds = sessions.map((session) => session.participants[0]?.senderId || session.participants[1]?.senderId);

      // Fetch users with the extracted senderIds
      const users = await Profile.find({
        _id: { $in: senderIds },
      });

      res.status(200).json(users);
      console.log(users);
    }
  } catch (error) {
    console.error("Error finding chat sessions:", error);
    next(error);
  }
};

export const getLastMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      $or: [
        {
          senderId: req.query.loggedUserId,
          receiverId: req.query.receiverId,
        },
        {
          senderId: req.query.receiverId,
          receiverId: req.query.loggedUserId,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();
    // if (message) {
    //   const createdAt = new Date(message.createdAt);
    //   const now = new Date();

    //   // Format the date based on the condition
    //   const isToday = createdAt.toDateString() === now.toDateString();
    //   const yesterday = new Date();
    //   yesterday.setDate(yesterday.getDate() - 1);
    //   const isYesterday = createdAt.toDateString() === yesterday.toDateString();

    //   if (isToday) {
    //     message.createdAt = createdAt.toLocaleTimeString([], {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     }); // "10:15 AM"
    //   } else if (isYesterday) {
    //     message.createdAt = "Yesterday";
    //   } else {
    //     message.createdAt = createdAt.toLocaleDateString(); // "3/30/2025"
    //   }
    // }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
