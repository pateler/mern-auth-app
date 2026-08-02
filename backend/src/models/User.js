import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
  },
  {
    timestamps: true,
  },
);

// FIXED: Use async/await without next parameter
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

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require("jsonwebtoken");
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE },
  );
};

userSchema.methods.updateLastLogin = async function () {
  // Use findByIdAndUpdate to avoid triggering pre-save hooks
  await this.constructor.findByIdAndUpdate(
    this._id,
    { lastLogin: new Date() },
    { runValidators: false }
  );
  this.lastLogin = new Date();
  return this;
};

export default mongoose.model("User", userSchema);
