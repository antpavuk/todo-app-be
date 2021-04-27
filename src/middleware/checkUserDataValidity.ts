import { Request, Response, NextFunction } from "express";

function validEmail(userEmail: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
}

export const checkUserDataValidity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, username, password } = req.body;

  if (req.path.includes("/signup")) {
    if (![email, username, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    } else if (password && password.length < 5) {
      return res.status(401).json("Short password");
    }
  } else if (req.path.includes("/login")) {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};
