import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) =>
  jwt.sign({ user: { id: userId } }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "3m",
  });

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ user: { id: userId } }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
