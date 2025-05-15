import { getPosts } from "../db/database.mjs";
import MongoDb from "mongodb";
import * as UserRepository from "./auth.mjs";
const ObjectID = MongoDb.ObjectId;

// 모든 포스트를 리턴
export async function getAll() {
  return getPosts().find().sort({ createAt: -1 }).toArray();
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(id) {
  return getPosts()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalPost);
}

// 포스트 작성
export async function create(text,title, id) {
  console.log("id:", id);
  return UserRepository.findByid(id).then((user) =>
    getPosts()
      .insertOne({
        userid: user.userid,
        name: user.name,
        text,
        title,
        createAt: new Date(),
        useridx: user.id,
      })
      .then((result) => {
        return getPosts().findOne({ _id: result.insertedId });
      })
  );
}

// post 변경
export async function update(id, text,title) {
  return getPosts()
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { text ,menu } },
      { returnDocument: "after" }
    )
    .then((result) => result);
}

// 포스트 삭제
export async function remove(id) {
  return getPosts().deleteOne({ _id: new ObjectID(id) });
}

function mapOptionalPost(post) {
  return post ? { ...post, id: post._id.toString() } : post;
}
