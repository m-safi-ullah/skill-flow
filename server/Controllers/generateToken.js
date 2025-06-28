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
    // { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: false,
    secure: true,
    // maxAge: 36000000,
  });
};

export const verifyToken = (req, res) => {
  try {
    const cookie = req.header("cookie");
    if (!cookie) {
      res.clearCookie("token");
      return { isValid: false, decoded: null };
    }

    const token = cookie.split("=")[1];
    if (!token) {
      res.clearCookie("token");
      location.reload();
      return { isValid: false, decoded: null };
    }

    const decoded = jwt.verify(token, secret);
    return { isValid: true, decoded };
  } catch (error) {
    return { isValid: false, decoded: null };
  }
};

export const frontEndTokenVerification = (req, res) => {
  try {
    const cookie = req.header("cookie");
    const token = cookie.split("=")[1];

    if (!token) {
      location.reload();
      return res
        .status(401)
        .json({ isValid: false, message: "Token not found" });
    }

    jwt.verify(token, secret);

    return res.status(200).json({ isValid: true, message: "User Authorized" });
  } catch (error) {
    res.clearCookie("token");
    console.error("Token verification failed:", error.message);
    return res
      .status(403)
      .json({ isValid: false, message: "UnAuthorized User" });
  }
};
