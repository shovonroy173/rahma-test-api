import { Schema, model } from "mongoose";

const ProfileSchema = new Schema(
  {
    birthCountry: { type: Object },
    bio: { type: String },
    convert: { id: Number, title: String },
    drinkingHabitAlcohol: { id: Number, title: String },
    drinkingHabitBeer: { id: Number, title: String },
    eatingHabit: { id: Number, title: String },
    education: { id: Number, title: String },
    email: { type: String },
    emailOtp: { type: String },
    ethnic: { type: Object },
    ethnicOrigin: { type: Object },
    futureChildren: { id: Number, title: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    grownUp: { type: Object },
    height: { id: Number, cm: Number, ft: Number },
    idType: { id: String, title: String },
    img: { type: String },
    images: {
      img1: { type: String },
      img2: { type: String },
      img3: { type: String },
      img4: { type: String },
      img5: { type: String },
      img6: { type: String },
      img7: { type: String },
      img8: { type: String },
    },
    knowStatus: { type: [String] },
    looking: { id: String, title: String, subTitle: String },
    maritalStatus: { id: Number, title: String },
    marriedStatus: { type: [String] },
    moveAbroad: { id: Number, title: String },
    phone: { type: String },
    prayingHabit: { id: Number, title: String },
    presentCountry: { type: Object },
    presentChildren: { id: Number, title: String },
    profession: { type: String },
    religiousType: { id: Number, title: String },
    salary: { min: String, max: String },
    sect: { id: Number, title: String },
    selectedOptions: {
      type: Map,
      of: [Object],
    },
    selectedPersonalities: {
      type: Map,
      of: [Object],
    },
    smokingHabit: { id: Number, title: String },
    user: {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
    },
    calendar: { type: Date },
    likedYou: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    liked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    matches: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  { timestamps: true }
);

export default model("Profile", ProfileSchema);
