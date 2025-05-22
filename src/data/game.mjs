import { getUsers } from "../db/database.mjs";
import { ObjectId } from "mongodb";

// 단계별 포인트 지급
export async function giveGamePoint(userId, stage) {
  const users = getUsers();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  const stageIndex = Number(stage);
  const STAGE_POINTS = [0, 400, 600, 800, 1000, 1700];

  if (isNaN(stageIndex) || stageIndex < 1 || stageIndex > 5) {
    throw new Error("유효하지 않은 스테이지 값입니다 (1~5)");
  }

  const reward = STAGE_POINTS[stageIndex];

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $inc: { point: reward },
      $addToSet: { clearedStages: stageIndex },
    }
  );

  return reward;
}

// 스테이지 초기화
export async function endGame(userId) {
  const users = getUsers();
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { $unset: { clearedStages: "" } } // 필드 제거
  );
  return result.modifiedCount > 0;
}
