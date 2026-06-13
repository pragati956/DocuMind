import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
    },

    githubId: {
      type: String,
    },

    role: {
      type: String,
      default: "Student",
    },

    bio: {
      type: String,
      default: "",
    },

    notificationPreferences: {
      upload: {
        type: Boolean,
        default: true,
      },

      summary: {
        type: Boolean,
        default: true,
      },

      weekly: {
        type: Boolean,
        default: false,
      },

      security: {
        type: Boolean,
        default: true,
      },

      email: {
        type: Boolean,
        default: true,
      },

      browser: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({
 email:1
});

export const UserModel =
  mongoose.model("User", UserSchema);