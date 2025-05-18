import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }
  // Bearer sadnlkjnvsknfla(토큰) --> [1] = 토큰
  const token = authHeader.split(" ")[1];
  console.log(token);

  //   검증(디코딩)
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log(decoded.id);
    const user = await authRepository.findByid(decoded.id);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("user.id: ", user.id);
    console.log("user.userid :", user.userid);
    req.id = user.id;
    next();
  });
};

// idx -primary
// 이미지 url
// 제품명
// 제품설명
// 가격
// 수량

/* 아이스크림
전체 가져오기
 idx로 가져오기*/

/*장바구니 --로그인 토큰
idx로 가져오기
아이스크림 삭제하기
*/
