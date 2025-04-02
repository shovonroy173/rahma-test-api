import Profile from "../models/Profile.js";

export const getUser = async (req, res, next) => {
  // console.log("LINE AT 4 in userController", req.query.id);

  try {
    // { email: req.query.email }
    const user = await Profile.findById(req.query.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  // console.log("LINE AT 4 in userController", req.query.email);

  try {
    // { email: req.query.email }
    const user = await Profile.find({
      _id: { $ne: req.query.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getLikedUsers = async (req, res, next) => {
  console.log('liked', req.query.id);

  try {
    const users = await Profile.findById(req.query.id).populate("liked");
    res.status(200).json(users?.liked);
  } catch (error) {
    next(error);
  }
};

export const getLikedYouUsers = async (req, res, next) => {
  console.log('liked you', req.query.id);
 
  try {
    const users = await Profile.findById(req.query.id).populate("likedYou");
    res.status(200).json(users?.likedYou);
  } catch (error) {
    next(error);
  }
};


export const getMatchedUsers = async (req, res, next) => {
  console.log('liked you', req.query.id);
 
  try {
    const users = await Profile.findById(req.query.id).populate("matches");
    res.status(200).json(users?.matches);
  } catch (error) {
    next(error);
  }
};
