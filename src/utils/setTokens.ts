import { generateAccessToken, generateRefreshToken } from "./jwtGenerator";

const setTokens = (userId: string) => {
  const token = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { token, refreshToken };
};

export default setTokens;
