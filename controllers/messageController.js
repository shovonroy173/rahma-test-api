import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";

export const getActiveConversation = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({
      participants: req.query.id,
      status: "active",
    });
    if (sessions.length <= 0) {
      return res.status(400).json({ message: "No active conversation found" });
    } else {
      const participantsPairs = sessions.map((session) => session.participants);

      const messages = await Message.find({
        $or: participantsPairs.map(([user1, user2]) => ({
          $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 },
          ],
        })),
      }).sort({ createdAt: 1 });

      const otherUserIds = new Set();
      messages.forEach((msg) => {
        if (msg.senderId.toString() !== req.query.id) {
          otherUserIds.add(msg.senderId.toString());
        }
        if (msg.receiverId.toString() !== req.query.id) {
          otherUserIds.add(msg.receiverId.toString());
        }
      });

      // Fetch details of other users
      const users = await Profile.find({
        _id: { $in: Array.from(otherUserIds) },
      });

      res.status(200).json(users);
      console.log(messages);
    }
  } catch (error) {
    console.error("Error finding chat sessions:", error);
    next(error);
  }
};

export const getRequestConversation = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({
      participants: req.query.id,
      status: "request",
    });
    console.log("request chat session", sessions);
    if (sessions?.length <= 0) {
      return res.status(400).json({ message: "No request conversation found" });
    } else {
      const participantsPairs = sessions.map((session) => session.participants);

      const messages = await Message.find({
        $or: participantsPairs.map(([user1, user2]) => ({
          $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 },
          ],
        })),
      }).sort({ createdAt: 1 });

      const otherUserIds = new Set();
      messages.forEach((msg) => {
        if (msg.senderId.toString() !== req.query.id) {
          otherUserIds.add(msg.senderId.toString());
        }
        if (msg.receiverId.toString() !== req.query.id) {
          otherUserIds.add(msg.receiverId.toString());
        }
      });

      // Fetch details of other users
      const users = await Profile.find({
        _id: { $in: Array.from(otherUserIds) },
      });

      res.status(200).json(users);
      console.log(messages);
    }
  } catch (error) {
    console.error("Error finding chat sessions:", error);
    next(error);
  }
};

export const getLastMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      senderId: req.query.loggedUserId,
      receiverId: req.query.receiverId,
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
