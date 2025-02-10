import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profilePic: String,
  name: String,
  email: String,
  role: String,
  phone: String,
  address: String,
  about: String,
  skills: String,
});

const ProfileModel = mongoose.model("profile", profileSchema);
export default ProfileModel;
