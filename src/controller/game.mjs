import * as gameRepository from "../data/game.mjs";

/**
 * 게임 스테이지 클리어 시 포인트를 지급하는 함수
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
export async function claimGamePoint(req, res) {
  // 요청 body에서 stage 값을 추출
  const { stage } = req.body;

  try {
    // gameRepository의 giveGamePoint 함수를 호출하여 포인트 지급
    // req.user.id: 현재 로그인한 사용자의 ID
    // stage: 클리어한 스테이지 번호
    const reward = await gameRepository.giveGamePoint(req.user.id, stage);

    // 성공 시 200 상태코드와 함께 응답
    res.status(200).json({
      message: `${stage}단계 클리어 포인트 지급 완료`,
      point: reward,  // 지급된 포인트
    });
  } catch (err) {
    // 실패 시 400 상태코드와 함께 에러 메시지 반환
    res.status(400).json({
      message: "게임 포인트 지급 실패",
      error: err.message,
    });
  }
}


export async function getPoint(req, res) {
  try {
    // 사용자 인증 상태 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "인증되지 않은 사용자입니다.",
      });
    }

    // 사용자 ID 추출
    const userId = req.user.id;
    // 사용자 정보 조회
    const userInfo = await gameRepository.getPoint(userId);

    // 성공 시 200 상태코드와 함께 사용자 정보 반환
    res.status(200).json({
      message: "사용자 정보 조회 완료",
      name: userInfo.name,           // 사용자 이름
      point: userInfo.point,         // 보유 포인트
      maxClearedStage: userInfo.maxClearedStage  // 최대 클리어 스테이지
    });
  } catch (err) {
    // 에러 발생 시 콘솔에 로그 출력
    console.error('getPoint 컨트롤러 에러:', err);
    // 실패 시 400 상태코드와 함께 에러 메시지 반환
    res.status(400).json({  
      message: "사용자 정보 조회 실패",
      error: err.message,
    });
  }
}

      