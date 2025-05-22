import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import { config } from "../../config.mjs";

const AUTH_ERROR = { message: "인증에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey); // 동기 verify
    const user = await authRepository.findByid(decoded.id);

    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    // 로그인 정보 req에 저장
    req.user = {
      id: user.id,
      userid: user.userid,
      name: user.name
    };

    next();
  } catch (error) {
    return res.status(401).json(AUTH_ERROR);
  }
};
