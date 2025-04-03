import { model, Schema } from "mongoose";

const ChatSessionSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    status: {
      type: String,
      enum: ["active", "request"],
      default: "request",
    },
  },
  {
    timestamps: true,
  }
);

export default model("ChatSession", ChatSessionSchema);
