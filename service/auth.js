import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// const sessionIdToUserMap = new Map();

export function setUser(user) {
  return jwt.sign({
    _id : user._id,
    email: user.email,
    role : user.role,
  }, SECRET_KEY);
}

// export function setUser(id, user) {
//   sessionIdToUserMap.set(id, user);
// }

export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
}
