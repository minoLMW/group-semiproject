import { getUsers } from "../db/database.mjs";
import { ObjectId } from "mongodb";

// 단계별 포인트 지급
export async function giveGamePoint(userId, stage) {
  const users = getUsers();
  const user = await users.findOne({ _id: new ObjectId(userId) });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  const stageIndex = Number(stage);
  const STAGE_POINTS = [0, 400, 800, 1200, 1600, 11600];

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

//사용자 이름, 포인트 반환
export async function getPoint(userId) {
  try {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    const users = getUsers();
    if (!users) {
      throw new Error('데이터베이스 연결이 없습니다.');
    }

    const result = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { name: 1, point: 1, clearedStages: 1 } }
    );
    
    if (!result) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // clearedStages 배열이 없거나 비어있는 경우 0 반환
    const maxClearedStage = result.clearedStages && result.clearedStages.length > 0 
      ? Math.max(...result.clearedStages) 
      : 0;
    
    return {
      name: result.name,
      point: result.point,
      maxClearedStage: maxClearedStage
    };
  } catch (error) {
    console.error('getPoint 에러:', error);
    throw error;
  }
}
