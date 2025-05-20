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
