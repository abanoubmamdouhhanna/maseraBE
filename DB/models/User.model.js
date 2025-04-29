import mongoose, { model, Schema, Types } from "mongoose";

// 🔹 Main User Schema
const userSchema = new Schema(
  {
    // 🔹 Personal Info
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    ebarshia: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id; // Optional: remove default `id`
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// 🔹 Middleware to exclude soft-deleted users
userSchema.pre(/^find/, function (next) {
  if (!this.getOptions || !this.getOptions()?.skipDeletedCheck) {
    this.where({ isDeleted: false });
  }
  next();
});

// 🔹 Model Export
const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
