import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    message: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
