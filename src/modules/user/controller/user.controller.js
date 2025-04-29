import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

// ✅ Add new user
export const add = asyncHandler(async (req, res, next) => {
  const { name, phone, age, gender, ebarshia, year, money } = req.body;

  if (!phone || !name) {
    return next(new Error("Name and phone are required", { cause: 400 }));
  }

  const existingUser = await userModel.findOne({ phone });
  if (existingUser) {
    return next(new Error("Phone number already exists", { cause: 409 }));
  }

  const newUser = await userModel.create({
    name,
    phone,
    age,
    gender,
    ebarshia,
    year,
    money,
  });

  return res.status(201).json({
    message: "User added successfully",
    user: newUser,
  });
});

// ✅ Get user by phone
export const getUser = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new Error("Phone number is required", { cause: 400 }));
  }

  const user = await userModel.findOne({ phone }).lean();
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "User fetched successfully",
    user,
  });
});

// ✅ Add money to user
export const addMoney = asyncHandler(async (req, res, next) => {
  const { phone, newValue } = req.body;

  if (!phone || typeof newValue !== "number") {
    return next(new Error("Phone and a valid newValue (number) are required", { cause: 400 }));
  }

  const user = await userModel.findOne({ phone });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const updatedUser = await userModel.findOneAndUpdate(
    { phone },
    { $inc: { money: newValue } },
    { new: true }
  );

  return res.status(200).json({
    message: "Money updated successfully",
    user: updatedUser,
  });
});
