import * as iceRepository from "../data/icecream.mjs";

// 아이스크림 생성
export async function createIce(req, res, next) {
  const { _idx, ice_name, Image_URL, Description } = req.body;
  const icecreams = await iceRepository.createIce(
   { _idx:String(_idx),
    name:ice_name,
    Image_URL,
    Description}
  );
  res.status(201).json(icecreams);
}
