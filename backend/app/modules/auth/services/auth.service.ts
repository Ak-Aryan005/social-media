import User from "../../user/models/user.model";
import { RegisterBody, LoginBody } from "../auth.types";
import {generateToken,generateRefreshToken,} from "../../../utils/jwt";
import Token from "../models/auth.model";
import config from "../../../config/config";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import { sendVerificationEmail } from "../../../utils/mail";
import { logger } from "../../../config/logger";
import { generateOTP } from "../../../utils/common";
import Otp from "../models/otp.model";
import { verifyToken } from "../../../utils/jwt";



const generateAuthTokens = async (user: any) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const exist = await Token.findOne({user:user.id});
  if(exist){
exist.token = refreshToken;
exist.user = user.id;
exist.type = "refresh";
exist.expires = new Date(
  Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
);
await exist.save();
return {
    access: {
      token: accessToken,
      expires: new Date(
        Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000
      ),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(
        Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
      ),
    },
  };
  }
  await Token.create({
    token: refreshToken,
    user: user.id,
    type: "refresh",
    expires: new Date(
      Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
    ),
  });
  return {
    access: {
      token: accessToken,
      expires: new Date(
        Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000
      ),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(
        Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
      ),
    },
  };
};

export const register = async (userData: RegisterBody) => {
  try {
    let userExist = null;
    if (userData.email) {
      // user entered email → check email only
      userExist = await User.findOne({ email: userData.email });
    } else if (userData.phone) {
      // user entered phone → check phone only
      userExist = await User.findOne({ phone: userData.phone });
    }
    console.log(userExist);
    if (userExist) throw new ApiError(httpStatus.BAD_REQUEST, "USER ALREADY EXIST");
    const user = await User.create(userData);
    const otp = generateOTP();
    if (userData.email) {
      userData.purpose = "verifyEmail";
    } else if (userData.phone) {
      userData.purpose = "verifyPhone";
    }
    const generatedOtp = await Otp.create({
      email: user.email,
      phone: user.phone,
      code: otp,
      user: user._id,
      purpose: userData.purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
    });
    try {
      await sendVerificationEmail(user.email, user.username, otp);
    } catch (error: any) {
      // Log error but don't fail registration
      logger.error(`Failed to send verification email: ${error.message}`);
    }
    return user;
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const verifyEmailOrPhone = async (userData: {
  email?: string;
  code: string;
  phone?: string;
  purpose: string;
}) => {
  try {
    const { email, code, phone } = userData;
    const otpCode = await Otp.findOne({ $or: [{ email }, { phone }] });
    // console.log(`otp ${otpCode}`)
    const userExist = await User.findOne({
      $and: [{ email }, { isEmailVerified: true }],
    });
    // console.log(`usexist ${userExist}`)
    if (userExist)
      throw new ApiError(httpStatus.BAD_REQUEST, "USER ALREADY VERIFIED");
    if (!otpCode) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "email or phone not found");
    }
    let user = null;
    if (userData.email) {
      // user entered email  check email only
      user = await User.findOne({ email });
    } else if (userData.phone) {
      // user entered phone  check phone only
      user = await User.findOne({ phone: userData.phone });
    }

    // console.log(user);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
    if (email) {
      userData.purpose = "verifyEmail";
    } else if (phone) {
      userData.purpose = "verifyPhone";
    }
    if (otpCode.code === code) {
      await Otp.deleteMany({ user: user._id, purpose: userData.purpose });
      if (email) user.isEmailVerified = true;
      if (phone) user.isPhoneVerified = true;
      await user.save();
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "OTP IS INCORRECT");
    }
    return {};
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const login = async (userData: LoginBody) => {
  try {
    const { email, password, phone } = userData;
    let user = null;
    if (userData.email) {
      // user entered email  check email only
      user = await User.findOne({ email });
    } else if (userData.phone) {
      // user entered phone  check phone only
      user = await User.findOne({ phone: userData.phone });
    }
    // console.log(user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
    if ((email && !user.isEmailVerified) || (phone && !user.isPhoneVerified)) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not verified");
    }
    const isMatch = await user.comparePassword(password);
    //  console.log(isMatch)
    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, "LOGIN_FAILED");
    }
    const token = await generateAuthTokens({
      id: user.id, // FIXED
      email: user.email,
      role: user.role,
    });
    user.isActive=true;
    await user.save()
    return {
      user,
      token: token.access.token,
      refreshToken: token.refresh.token,
    };
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const sendOtp = async (userInfo: { email: string; phone: string; purpose:string }) => {
  try {
    const { email, phone,purpose } = userInfo;
    if(purpose==="resetPassword"){
      let user = null;
    if (email) {
      // user entered email  check email only
      user = await User.findOne({ email, isEmailVerified: true });
    } else if (phone) {
      // user entered phone  check phone only
      user = await User.findOne({ phone, isPhoneVerified: true });
    }
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
  
    const otp = generateOTP();
    const generatedOtp = await Otp.create({
      email: user.email,
      code: otp,
      user: user._id,
      purpose: "resetPassword",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
    });
     try {
      await sendVerificationEmail(user.email, user.username, otp);
    } catch (error: any) {
      // Log error but don't fail registration
      logger.error(`Failed to send verification email: ${error.message}`);
    }
  } 
  if(purpose === "verifyEmail"){
    //  const { email, phone } = userInfo;
      let user = null;
    if (email) {
      // user entered email  check email only
      user = await User.findOne({ email, isEmailVerified: false });
    } else if (phone) {
      // user entered phone  check phone only
      user = await User.findOne({ phone, isPhoneVerified: false });
    }
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
        const otp = generateOTP();
    const generatedOtp = await Otp.create({
      email: user.email,
      code: otp,
      user: user._id,
      purpose: "verifyEmail",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
    });
     try {
      await sendVerificationEmail(user.email, user.username, otp);
    } catch (error: any) {
      // Log error but don't fail registration
      logger.error(`Failed to send verification email: ${error.message}`);
    }
  }
   
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const verifyOtp = async (data: any) => {
  try {
    const { email, code, phone, purpose } = data;
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    console.log(user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }

    const otpCode = await Otp.findOne({ user: user._id });
    console.log(`otcd ${otpCode}`);
    if (otpCode?.code === code) {
      await Otp.deleteMany({ user: user._id, purpose: "resetPassword" });
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "OTP IS INCORRECT");
    }
    const token = generateToken({
      id: user.id, // FIXED
      email: user.email,
      role: user.role,
    });
    return token
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const forgotPassword = async (userData: any,user:any) => {
  try {
    const { password,email } = userData;
if(user){
    const existingUser = await User.findOne({ _id:user.id });
    console.log(`user ${existingUser}`)
    if (!existingUser)
      throw new ApiError(httpStatus.UNAUTHORIZED, "USER NOT FOUND");
        existingUser.password = password; 
    await existingUser.save(); 
    return existingUser
}
  const existingUser = await User.findOne({ email:email });
    console.log(`user ${existingUser}`)
    if (!existingUser)
      throw new ApiError(httpStatus.UNAUTHORIZED, "USER NOT FOUND");
        existingUser.password = password; 
    await existingUser.save(); 
    return existingUser;
  } catch (error: any) { 
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


export const resetPassword = async (userData:any,userInfo:any)=>{
  try {
      const { oldpassword,password } = userData;
    const user = await User.findOne({ _id:userInfo.id });
    console.log(`user ${user}`)
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, "USER NOT FOUND");
       const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, "LOGIN_FAILED");
    }
    if(isMatch){
              user.password = password; 
              await user.save(); 
    }else{
            throw new ApiError(httpStatus.UNAUTHORIZED, "INCORRECT PASSWORD");
    }
    return user
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const logout = async (userInfo:any) => {
  try {
     const user = await User.findOne({ _id:userInfo.id });
    // console.log(`user ${user}`)
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, "USER NOT FOUND");
    const token =await Token.findOne({ user:userInfo.id });
    if(token){
      await token.deleteOne({user:user.id})
    }
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      type: "refresh",
    });

    if (!tokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token not found");
    }

    if (tokenDoc.expires < new Date()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token expired");
    }

    const decoded = verifyToken(refreshToken, config.jwt.secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }

    const tokens = await generateAuthTokens(user);

    return {
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token,
    };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
};
