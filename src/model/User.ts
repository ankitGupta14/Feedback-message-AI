import mongoose, { Schema, Document } from "mongoose";

//-------------------------------Message Schema and Model-------------------------------
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
//-------------------------------User Schema and Model-------------------------------
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verfiyCode: string;
  isVerified: boolean;
  verfiyCodeExpire: Date;
  isAccpectingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verfiyCode: {
    type: String,
    required: [true, "verfiycode is required"],
  },
  verfiyCodeExpire: {
    type: Date,
    required: [true, "verfiyCodeExpire is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAccpectingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;