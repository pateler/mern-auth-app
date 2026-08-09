import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    workspace: {
      name: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    preferences: {
      timezone: {
        type: String,
        default: 'Asia/Kolkata (IST)',
      },
      currency: {
        type: String,
        default: 'INR - Indian Rupees',
      },
      notifications: {
        emailNewOrders: { type: Boolean, default: true },
        emailRefunds: { type: Boolean, default: true },
        emailChat: { type: Boolean, default: true },
        emailFailedPayments: { type: Boolean, default: true },
        pushBrowser: { type: Boolean, default: true },
        pushMobile: { type: Boolean, default: false },
        smsOrderConfirmations: { type: Boolean, default: true },
        smsDeliveryUpdates: { type: Boolean, default: false },
      },
    },
    companyDetails: {
      companyName: { type: String, default: '' },
      contactNumber: { type: String, default: '' },
      businessAddress: { type: String, default: '' },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    activeSessions: [{
      device: String,
      browser: String,
      location: String,
      ip: String,
      lastActive: Date,
      isCurrent: { type: Boolean, default: false },
    }],
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware - hash password
userSchema.pre("save", async function () {
  // Only hash the password if it's modified
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token - FIXED: Use imported jwt
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

userSchema.methods.updateLastLogin = async function () {
  await this.constructor.findByIdAndUpdate(
    this._id,
    { lastLogin: new Date() },
    { runValidators: false }
  );
  this.lastLogin = new Date();
  return this;
};

export default mongoose.model("User", userSchema);