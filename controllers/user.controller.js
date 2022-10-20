const { UserModel } = require("../models/user");
const { hashString } = require("../modules/utils");
const { isValidObjectId } = require("mongoose");
const path = require("path");
async function createUser(req, res, next) {
  try {
    const { username, password, email, mobile, age } = req.body;
    let user;
    const mobileRegexp = /^09[0-9]{9}/;
    const emailRegexp = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;
    if (!mobileRegexp.test(mobile)) throw { status: 400, message: "mobile not correct" };
    if (!emailRegexp.test(email)) throw { status: 400, message: "email not correct" };
    if (password.length < 6 || password.length > 16)
      throw {
        status: 400,
        message: "password must be grater than 6 chars and less than 16 chars",
      };

    user = await UserModel.findOne({ username });
    if (user) throw { status: 400, message: "username exist" };
    user = await UserModel.findOne({ email });
    if (user) throw { status: 400, message: "email used before" };
    user = await UserModel.findOne({ mobile });
    if (user) throw { status: 400, message: "mobile used before" };
    const hashPassword = hashString(password);
    const userCreateResult = await UserModel.create({
      username,
      password: hashPassword,
      email,
      mobile,
      age,
    });
    if (userCreateResult) {
      return res.json(userCreateResult);
    }
    throw { status: 500, message: "user can not be created" };
  } catch (error) {
    next(error);
  }
}

async function listOfUsers(req, res, next) {
  try {
    let users = await UserModel.find({}, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ _id: -1 });
    users = users.map((user) => {
      user.profile_image = req.protocol + "://" + req.get("host") + user.profile_image.replace(/[\\\\]/gm, "/");
      return user;
    });
    return res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw { status: 400, message: "user id is not valid" };
    const user = await UserModel.findOne({ _id: id }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    if (!user) throw { status: 400, message: "user not found" };
    user.profile_image = req.protocol + "://" + req.get("host") + user.profile_image.replace(/[\\\\]/gm, "/");
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw { status: 400, message: "user id is not valid" };
    const user = await UserModel.findById(id);
    if (!user) throw { status: 404, message: "user not found" };
    const result = await UserModel.deleteOne({ _id: id });
    if (result.deletedCount > 0)
      return res.json({
        status: 200,
        success: true,
        message: "user deleted successfully",
      });
    throw { status: 500, message: "user not deleted" };
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw { status: 400, message: "user id is not valid" };
    userFindResult = await UserModel.findById(id);
    if (!userFindResult) throw { status: 404, message: "user not found" };

    const { username, email, mobile } = req.body;
    let data = { ...req.body };
    if (!username && !email && !mobile) throw { status: 500, message: "required at least one field in the body" };
    const mobileRegexp = /^09[0-9]{9}/;
    const emailRegexp = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;
    if (mobile && !mobileRegexp.test(mobile)) throw { status: 400, message: "mobile not correct" };
    if (email && !emailRegexp.test(email)) throw { status: 400, message: "email not correct" };
    Object.entries(data).forEach(([key, value]) => {
      if (!value || ["", " ", ".", null, undefined].includes(value) || value.length < 3) {
        delete data[key];
      }
      if (!["username", "email", "mobile"].includes(key)) {
        delete data[key];
      }
    });
    const result = await UserModel.updateOne(
      { _id: id },
      {
        ...data,
      }
    );
    if (result.modifiedCount > 0)
      return res.json({
        status: 200,
        success: true,
        message: "user updated successfully",
      });
    throw { status: 500, message: "user not updated" };
  } catch (error) {
    next(error);
  }
}

async function updateProfileImage(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw { status: 400, message: "id is not correct" };
    const prefixPath = path.join(__dirname, "../public");
    let image;
    if (req.file) {
      image = req.file.path.substring(prefixPath.length);
    } else {
      throw { status: 400, message: "please choose a file" };
    }
    const result = await UserModel.updateOne({ _id: id }, { $set: { profile_image: image } });
    if (result.modifiedCount <= 0) throw { status: 400, message: "image not updated" };
    return res.json({
      image: JSON.stringify(req.image),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  listOfUsers,
  getUserById,
  deleteUserById,
  updateUser,
  updateProfileImage,
};
