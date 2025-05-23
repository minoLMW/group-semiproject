import { config } from "../../config.mjs";
import MongoDb from "mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config;

let db;

export async function connectDB() {
  return MongoDb.MongoClient.connect(config.db.host).then((client) => {
    db = client.db();
	return db; 
    // console.log(db);
  });
}
export function getUsers() {
  return db.collection("users");
}

export function getPosts() {
  return db.collection("posts");
}

export async function getIcecreams(iceidx) {
	const db = await connectDB();
	return await db.collection("icecreams").findOne({ _idx: Number(iceidx) });
}

export function getCarts() {
  return db.collection("carts");
}
