import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
res.cookie("jwt", token, {
  httpOnly: true,
  secure: true, // Mandatory for HTTPS
  sameSite: "None", // Essential for cross-domain
  domain: ".onrender.com", // Main domain cookie
  path: "/",
  maxAge: 15 * 24 * 60 * 60 * 1000
});
//   res.cookie("jwt", token, {
//   httpOnly: true, // Prevents JavaScript access (basic security)
//   sameSite: "Lax", // Works well for local development
//   maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days expiration
// });
};

export default generateTokenAndSetCookie;
