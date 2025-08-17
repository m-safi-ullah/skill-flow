import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  profilePic: String,
  name: String,
  email: String,
  username: String,
  role: String,
  phone: String,
  address: String,
  about: String,
  skills: String,
  test: {
    score: { type: String, required: false },
    date: { type: String, required: false },
    voilation: { type: Boolean, default: false },
  },
});

const ProfileModel = mongoose.model("profiles", profileSchema);
export default ProfileModel;
