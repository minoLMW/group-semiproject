import * as iceRepository from "../data/icecream.mjs";

// 포스트를 생성하는 함수
export async function createIce(req, res, next) {
  const { _idx, ice_name, Image_URL, Description } = req.body;
  const icecreams = await iceRepository.createIce(
    _idx,
    ice_name,
    Image_URL,
    Description
  );
  res.status(201).json(icecreams);
}
