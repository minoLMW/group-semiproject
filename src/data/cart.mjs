import { getCarts } from "../db/database.mjs";
import MongoDb from "mongodb";

const ObjectId = MongoDb.ObjectId;

// 장바구니 전체 조회 (lookup + 총 가격 포함)
export async function findAllByUser(useridx) {
  return getCarts()
    .aggregate([
      { $match: { useridx } },
      {
        $lookup: {
          from: "icecreams",
          localField: "iceidx",
          foreignField: "idx",
          as: "icecreamInfo",
        },
      },
      { $unwind: "$icecreamInfo" },
      {
        $addFields: {
          totalPrice: { $multiply: ["$quantity", 4500] },
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

// 특정 아이스크림 조회 (사용자 기준)
export async function findByUserAndIce(useridx, iceidx) {
  return getCarts().findOne({ useridx, iceidx });
}

// 수량 증가 or 새 항목 추가
export async function increaseQuantityOrInsert(user, iceidx, quantity) {
  const parsedQty = Number(quantity);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    throw new Error("유효하지 않은 수량입니다");
  }

  const existing = await findByUserAndIce(user.id, iceidx);

  if (existing) {
    await getCarts().updateOne(
      { _id: existing._id },
      { $inc: { quantity: parsedQty } }
    );
    return getCarts().findOne({ _id: existing._id });
  }

  const newItem = {
    useridx: user.id,
    userid: user.userid,
    name: user.name,
    iceidx,
    quantity: parsedQty,
    createdAt: new Date(),
  };

  const result = await getCarts().insertOne(newItem);
  return getCarts().findOne({ _id: result.insertedId });
}

// 수량 수정 (0일 경우 자동 삭제)
export async function updateQuantity(useridx, iceidx, quantity) {
  const parsedQty = Number(quantity);
  if (isNaN(parsedQty)) {
    throw new Error("수량이 유효하지 않습니다");
  }

  if (parsedQty <= 0) {
    await deleteByUserAndIce(useridx, iceidx);
    return null;
  }

  const result = await getCarts().findOneAndUpdate(
    { useridx, iceidx },
    { $set: { quantity: parsedQty } },
    { returnDocument: "after" }
  );
  return result.value;
}

// 장바구니 항목 삭제
export async function deleteByUserAndIce(useridx, iceidx) {
  return getCarts().deleteOne({ useridx, iceidx });
}
