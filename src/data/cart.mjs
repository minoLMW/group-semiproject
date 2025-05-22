import { getCarts, getIcecreams, getUsers } from "../db/database.mjs";
import MongoDb from "mongodb";
import { login } from "./auth.mjs";
import { createIce } from "../controller/icecream.mjs";
import { getAllByUserid } from "./post.mjs";

const ObjectId = MongoDb.ObjectId;

// 장바구니 전체 조회
export async function findAllByUser(useridx) {
  return getCarts()
    .aggregate([
      { $match: { useridx: String(useridx) } },
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
          totalPrice: { $multiply: [{ $toInt: "$quantity" }, 4500] },
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
  return getCarts().findOne({
    useridx: String(useridx),
    iceidx: String(iceidx),
  });
}

// 메뉴에서 수량 입력 후 장바구니 담기 (있으면 누적, 없으면 추가)
export async function addOrIncrease(user, iceidx, quantity) {
  const parsedQty = Number(quantity);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    throw new Error("수량이 유효하지 않습니다");
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
    useridx: String(user.id),
    userid: user.userid,
    name: user.name,
    iceidx: String(iceidx),
    quantity: parsedQty,
    createdAt: new Date(),
  };

  const result = await getCarts().insertOne(newItem);
  return getCarts().findOne({ _id: result.insertedId });
}

// 장바구니 페이지에서 수량 수정
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
    {
      useridx: String(useridx),
      iceidx: String(iceidx),
    },
    { $set: { quantity: parsedQty } },
    { returnDocument: "after" }
  );

  // 정상 실패 (대상 없음)
  if (!result || !result.value) {
    return null;
  }

  // 정상 업데이트 성공
  return result.value;
}

// 장바구니 항목 삭제
export async function deleteByUserAndIce(useridx, iceidx) {
  return getCarts().deleteOne({
    useridx: String(useridx),
    iceidx: String(iceidx),
  });
}

// 장바구니 전체 구매
export async function clearCart(useridx) {
  return getCarts().deleteMany({ useridx: String(useridx) });
}

// 개별 장바구니 구매
const ICECREAM_PRICE = 4500;

export async function purchaseOneItem(user, iceidx, quantity) {
  const useridx = user.useridx;
  const totalPrice = quantity * ICECREAM_PRICE;

  const userData = await getUsers().findOne({ useridx });
  if (!userData || userData.point < totalPrice) {
    throw new Error("포인트가 부족합니다.");
  }

  const icecream = await getIcecreams().findOne({ idx: iceidx });
  if (!icecream) {
    throw new Error("해당 아이스크림이 존재하지 않습니다.");
  }

  await getUsers().updateOne({ useridx }, { $inc: { point: -totalPrice } });

  await getCarts().deleteOne({ useridx, iceidx }); // 장바구니에서 제거

  return {
    message: "구매 완료",
    used: totalPrice,
    remaining: userData.point - totalPrice,
    item: {
      name: icecream.ice_name,
      quantity,
      price: ICECREAM_PRICE,
    },
  };
}
