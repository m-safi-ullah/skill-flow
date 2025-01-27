import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verificationCode: String,
  role: String,
  cnic: String,
  codeExpiresAt: String,
  attachCnic: String,
});

const TempUser = mongoose.model("tempUser", AuthSchema);
export default TempUser;
