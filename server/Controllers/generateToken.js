import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const secret = "Skill$123@$Flow";
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: false,
    secure: true,
    maxAge: 36000000,
  });
};

export const verifyToken = (req, res) => {
  const token = req.header("token");

  if (token) {
    jwt.verify(token, "Skill$123@$Flow", (err, decoded) => {
      if (err) {
        return res
          .status(200)
          .json({ message: "Invalid token", isValid: false });
      } else {
        return res
          .status(200)
          .json({ message: "Token is valid", isValid: true });
      }
    });
  } else {
    return res.status(400).json({ message: "Token not found", isValid: false });
  }
};
