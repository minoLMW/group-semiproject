import { getUsers } from "../db/database.mjs";
import { ObjectId } from "mongodb";

const STAGE_POINTS = [0, 400, 1000, 1800, 2800, 4500];

export async function giveGamePoint(userId, stage) {
  const users = getUsers();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");
  if (user.gameStage !== undefined)
    throw new Error("이미 게임에 참여하였습니다.");

  const stageIndex = Number(stage);

  if (isNaN(stageIndex) || stageIndex < 1 || stageIndex > 5) {
    throw new Error("유효하지 않은 스테이지 값입니다 (1~5)");
  }

  const reward = STAGE_POINTS[stageIndex];

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $inc: { point: reward },
      $set: { gameStage: stageIndex },
    }
  );

  return reward;
}
