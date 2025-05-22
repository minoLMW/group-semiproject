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

export async function resetGame(req, res) {
  try {
    const success = await gameRepository.endGame(req.user.id);
    if (!success) throw new Error("초기화 실패 또는 이미 초기화됨");
    
    res.status(200).json({ message: "게임 세션 종료 및 초기화 완료" });
  } catch (err) {
    res.status(400).json({ message: "게임 종료 실패", error: err.message });
  }
}
