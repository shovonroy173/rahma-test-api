import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";

export const getActiveConversation = async (req, res, next) => {
  try {
    // Find chat sessions where receiverId matches the logged-in user and status is 'request'
    const sessions = await ChatSession.find({
      $or: [
        {
          "participants.senderId": req.query.id,
        },
        {
          "participants.receiverId": req.query.id,
        },
      ],
      status: "active",
    });

    // console.log("Request chat session", sessions);

    if (sessions?.length <= 0) {
      return res.status(400).json({ message: "No request conversation found" });
    } else {
      // Extract senderIds from the sessions (since we know receiverId is the logged-in user)
      const receiverIds = sessions.map(
        (session) =>
          session.participants[0]?.receiverId ||
          session.participants[1]?.receiverId
      );

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
      const senderIds = sessions.map(
        (session) =>
          session.participants[0]?.senderId || session.participants[1]?.senderId
      );

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
    const message = await Message.find({
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
      .limit(1)
      .lean();
    console.log("Last message", message);

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

export const acceptRequest = async (req, res, next) => {
  try {
    const { loggedUserId, requestId } = req.body;
    console.log(loggedUserId, requestId);

    const user = await Profile.findById(loggedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await Profile.findByIdAndUpdate(
      loggedUserId,
      {
        $pull: { requestconvos: { from: requestId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Request not found" });
    }

    await Profile.findByIdAndUpdate(loggedUserId, {
      $addToSet: { activeconvos: requestId },
    });

    const friendUser = await Profile.findByIdAndUpdate(requestId, {
      $addToSet: { activeconvos: loggedUserId },
    });

    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found" });
    }

    res.status(200).json({ message: "Request accepted sucesfully" });
  } catch (error) {
    console.log("Error", error);
    // res.status(500).json({ message: "Server Error" });
    next(error);
  }
};

export const sendRequest = async (req, res, next) => {
  const { senderId, receiverId, message } = req.body;

  console.log(senderId);
  console.log(receiverId);
  console.log(message);
  try {
    const receiver = await Profile.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    await Profile.findByIdAndUpdate(
      receiverId,
      {
        $addToSet: {
          requestconvos: {
            from: senderId,
            message: message,
          },
        },
      },
      { new: true }
    );

    // await receiver.save();

    res.status(200).json({ message: "Request sent succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const user = await Profile.findById(userId).populate("requestconvos.from");

    if (user) {
      res.status(200).json(user.requestconvos);
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getActives = async (req, res, next) => {
  try {
    const userId = req.query.id;

    const users = await Profile.findById(userId).populate("activeconvos");

    res.status(200).json(users.activeconvos);
  } catch (error) {
    console.log("Error fetching user", error);
  }
};
