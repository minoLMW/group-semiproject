import * as gameRepository from "../data/game.mjs";

export async function claimGamePoint(req, res) {
  const { stage } = req.body;

  try {
    const reward = await gameRepository.giveGamePoint(req.user.id, stage);

    res.status(200).json({
      message: `${stage}단계 클리어 포인트 지급 완료`,
      point: reward,
    });
  } catch (err) {
    res.status(400).json({
      message: "게임 포인트 지급 실패",
      error: err.message,
    });
  }
}

export async function getPoint(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "인증되지 않은 사용자입니다.",
      });
    }

    const userId = req.user.id;
    const userInfo = await gameRepository.getPoint(userId);

    res.status(200).json({
      message: "포인트 조회 완료",
      name: userInfo.name,
      point: userInfo.point
    });
  } catch (err) {
    console.error('getPoint 컨트롤러 에러:', err);
    res.status(400).json({  
      message: "포인트 조회 실패",
      error: err.message,
    });
  }
}

      