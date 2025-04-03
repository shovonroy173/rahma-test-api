import { Schema, model } from "mongoose";

const ChatSessionSchema = new Schema(
  {
    participants: [
      {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "Profile", // Refers to the Profile collection for the sender
        },
        receiverId: {
          type: Schema.Types.ObjectId,
          ref: "Profile", // Refers to the Profile collection for the receiver
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "request"],
      default: "request",
    },
  },
  { timestamps: true }
);

export default model("ChatSession", ChatSessionSchema);
