import { getIcecreams } from "../db/database.mjs";
import { loadIcecreamData } from "../data/icecream.mjs";

// 모든 포스트 / 해당 아이디에 대한 포스트를 가져오는 함수
// query : key=value값
export async function getIcecreams(req, res, next) {
  const data = await loadIcecreamData();
  const col = getIcecreams().collection("icecream");
  await col.deleteMany({});
//   const result = awiat col.insertMany(data)
}
