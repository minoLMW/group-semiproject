import { getIcecreams } from "../db/database.mjs";
import MongoDb from "mongodb";
const ObjectID = MongoDb.ObjectId;

// 포스트 작성
export async function createIce(_idx, ice_name, Image_URL, Description) {
  console.log("_idx:", _idx);
  const col = getIcecreams();
  return col.insertOne({
    idx: _idx,
    name: ice_name,
    description: Description,
    image_url: Image_URL,
  })
  .then((result) => result.insertedId.toString());
}
