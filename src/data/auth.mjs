import MongoDb from "mongodb";
import { getUsers } from "../db/database.mjs";

const ObjectID = MongoDb.ObjectId;

export async function getAll() {
  return users;
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((result) => result.insertedId.toString());
}

export async function login(userid, password) {
  const user = users.find(
    (user) => user.userid === userid && user.password === password
  );
  return user;
}

export async function findByUserid(userid) {
  return getUsers().find({ userid }).next().then(mapOptionalUser);
}

export async function findByid(id) {
  return getUsers()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalUser);
}

export async function findById(userId) {
  return getUsers().findOne({ _id: new ObjectID(userId) });
}

export async function updatePoint(userId, newPoint) {
  return getUsers().updateOne(
    { _id: new ObjectID(userId) },
    { $set: { point: newPoint } }
  );
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
