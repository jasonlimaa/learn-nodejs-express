const {UserModel} = require("../models/user");
const {hashString, jwtTokenGenerator, compareDataWithHash} = require("../modules/utils");

async function userRegister(req, res, next) {
    try {
        const {email, mobile, username, password, confirm_password} = req.body;
        const mobileRegexp = /^09[0-9]{9}/;
        const emailRegexp = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;
        if (!mobileRegexp.test(mobile)) throw {status: 400, message: "mobile not correct"};
        if (!emailRegexp.test(email)) throw {status: 400, message: "email not correct"};
        if (!password) throw {
            status: 400, message: "password is required",
        };
        if (password.length < 6 || password.length > 16) throw {
            status: 400, message: "password must be grater than 6 chars and less than 16 chars",
        };
        if (password !== confirm_password) throw {
            status: 400, message: "Password not match to confirm password",
        };
        let user = await UserModel.findOne({email});
        if (user) throw {status: 400, message: "email is exist"};
        user = await UserModel.findOne({mobile});
        if (user) throw {status: 400, message: "mobile is exist"};
        user = await UserModel.findOne({username});
        if (user) throw {status: 400, message: "username is exist"};

        await UserModel.create({
            mobile, username, email, password: hashString(password),
        });
        return res.status(201).json({
            status: 201, success: true, message: "user created successfully",
        });
    } catch (error) {
        next(error);
    }
}

async function userLogin(req, res, next) {
    try {
        const {username, password} = req.body;
        let user = await UserModel.findOne({username});
        if (!user) throw {status: 401, message: "username or password is wrong"};
        if (!compareDataWithHash(password, user.password)) throw {
            status: 401,
            message: "username or password is wrong"
        };

        const token = jwtTokenGenerator(user);
        user.token = token;
        user.save();
        return res.status(200).json({
            status: 200, success: true, message: "login successfully", token,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    userRegister, userLogin,
};
