import { getCarts } from "../db/database.mjs";
import MongoDb from "mongodb";

const ObjectId = MongoDb.ObjectId;

// 장바구니 전체 조회 (로그인한 사용자 기준+ icecream 정보 + totalPrice(수량*4500) 포함)
export async function findAllByUser(useridx) {
  return getCarts()
    .aggregate([
      { $match: { useridx } },
      {
        $lookup: {
          from: "icecreams", // 아이스크림 컬렉션
          localField: "iceidx", // cart.iceidx
          foreignField: "idx", // icecreams.idx (문자열)
          as: "icecreamInfo",
        },
      },
      { $unwind: "$icecreamInfo" },
      {
        $addFields: {
          totalPrice: { $multiply: ["$quantity", 4500] }, // 총 가격 계산
        },
      },
      {
        $project: {
          _id: 1,
          useridx: 1,
          userid: 1,
          name: 1,
          iceidx: 1,
          quantity: 1,
          createdAt: 1,
          totalPrice: 1,
          "icecreamInfo.name": 1,
          "icecreamInfo.image_url": 1,
          "icecreamInfo.description": 1,
        },
      },
    ])
    .toArray();
}
// 해당 사용자의 특정 아이스크림 조회
export async function findByUserAndIce(useridx, iceidx) {
  return getCarts().findOne({ useridx, iceidx });
}

// 수량 증가 또는 새로운 항목 추가
export async function increaseQuantityOrInsert(user, iceidx, quantity) {
  const existing = await findByUserAndIce(user.id, iceidx);

  if (existing) {
    await getCarts().updateOne({ _id: existing._id }, { $inc: { quantity } });
    return getCarts().findOne({ _id: existing._id });
  }

  const newItem = {
    useridx: user.id,
    userid: user.userid,
    name: user.name,
    iceidx,
    quantity,
    createdAt: new Date(),
  };

  const result = await getCarts().insertOne(newItem);
  return getCarts().findOne({ _id: result.insertedId });
}

// 수량 업데이트
export async function updateQuantity(useridx, iceidx, quantity) {
  const result = await getCarts().findOneAndUpdate(
    { useridx, iceidx },
    { $set: { quantity } },
    { returnDocument: "after" }
  );
  return result.value;
}

// 장바구니 항목 삭제
export async function deleteByUserAndIce(useridx, iceidx) {
  return getCarts().deleteOne({ useridx, iceidx });
}