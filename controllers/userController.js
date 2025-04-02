import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
export const user = async (req, res, next) => {
  console.log("User data", req.body);
  try {
    const newUser = new Profile(req.body);
    const savedUser = await newUser.save();
    console.log("newUser:", newUser, "savedUser:", savedUser);

    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await Profile.findOne({
      email,
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.secretKey);

      return res.status(200).json(token);
    }
  } catch (error) {
    next(error);
  }
};
// export const login = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     console.log('login controller LINE AT 58', email);
//     const user = await Profile.findOne({ email });
//     console.log(user);
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };
export const like = async (req, res, next) => {
  console.log("like", req.body);
  try {
    await Profile.findByIdAndUpdate(
      { _id: req.body.loggedUserId },
      {
        $addToSet: { liked: req.body.id },
      },
      { new: true }
    );
    await Profile.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $addToSet: { likedYou: req.body.loggedUserId },
      },
      { new: true }
    );
    const likedUser = await Profile.findById(req.body.id);
    if (likedUser.liked.includes(req.body.loggedUserId)) {
      // It's a match! Update both users' matches array
      await Profile.findByIdAndUpdate(
        loggedUserId,
        { $addToSet: { matches: req.body.id } },
        { new: true }
      );
      await Profile.findByIdAndUpdate(
        likedProfileId,
        { $addToSet: { matches: req.body.loggedUserId } },
        { new: true }
      );

      return res.status(200).json({ message: "It's a match!" });
    }

    res.status(200).json({
      message: "Liked success",
    });
    console.log("success");
  } catch (error) {
    next(error);
  }
};
