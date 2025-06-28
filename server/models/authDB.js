import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  cnic: String,
  cnicImage: String,
  verificationCode: String,
  restriction: {
    type: Boolean,
    default: false,
  },
});

const AuthModel = mongoose.model("users", AuthSchema);
export default AuthModel;
