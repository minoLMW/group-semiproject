import { config } from "../../config.mjs";
import MongoDb from "mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config;

let db;

export async function connectDB() {
  return MongoDb.MongoClient.connect(config.db.host).then((client) => {
    db = client.db();
    // console.log(db);
  });
}

export function getUsers() {
  return db.collection("users");
}

export function getPosts() {
  return db.collection("posts");
}

export function getIcecreams() {
  return db.collection("icecreams");
}

export function getCarts() {
  return db.collection("carts");
}
