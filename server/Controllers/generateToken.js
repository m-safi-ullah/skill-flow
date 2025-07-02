import jwt from "jsonwebtoken";
const secret = "Skill$123@$Flow";

export const generateToken = (user, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
      restricted: user.restriction || false,
    },
    secret
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
};

export const verifyToken = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.clearCookie("token", { path: "/" });
      return { isValid: false, decoded: null };
    }
    const decoded = jwt.verify(token, secret);
    return { isValid: true, decoded };
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.clearCookie("token", { path: "/" });
    return { isValid: false, decoded: null };
  }
};

export const frontEndTokenVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ isValid: false });

  try {
    const decoded = jwt.verify(token, secret);
    return res.status(200).json({ isValid: true, user: decoded });
  } catch (err) {
    return res.status(403).json({ isValid: false });
  }
};
