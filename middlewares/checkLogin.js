const { UserModel } = require("../models/user");
const { verifyJwtToken } = require("../modules/utils");

async function autoLogin(req, res, next) {
  try {
    req.user = null;
    req.isLogin = false;
    const headers = req?.headers;
    const token = headers?.authorization?.substring(7);
    if (!token) throw { status: 401, message: "please login" };
    const payload = verifyJwtToken(token);
    const user = await UserModel.findOne({ username: payload.username });
    if (!user) throw { status: 401, message: "please login again " };
    req.user = user;
    req.isLogin = true;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  autoLogin,
};
