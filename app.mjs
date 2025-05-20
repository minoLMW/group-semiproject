import express from "express";
import authRouter from "./src/router/auth.mjs";
import postsRouter from "./src/router/post.mjs";
import icecreamsRouter from "./src/router/icecream.mjs";
import cartsRouter from "./src/router/cart.mjs";
import gameRouter from "./src/router/game.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./src/db/database.mjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json())

// 1) HTML 폴더 절대 경로
const htmlDir = path.join(__dirname, "html");
// 2) assets 폴더 절대 경로
const assetsDir = path.join(__dirname, "assets");

// 정적 리소스 서빙 설정
app.use("/assets", express.static(assetsDir));
app.use("/html",   express.static(htmlDir)); 
app.use(express.static(htmlDir));

// GET 루트로 접속 시 main/index.html 파일 전송
app.get("/", (req, res) => {
  res.sendFile(path.join(htmlDir, "main", "index.html"));
});

// const app = express();
// app.use(express.json());
// app.use(express.static(path.join(process.cwd(), "html")));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/icecreams", icecreamsRouter);
app.use("/carts", cartsRouter);
app.use("/game", gameRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

connectDB()
  .then(() => {
    app.listen(config.host.port, () => {
      console.log("실행중");
    });
  })
  .catch(console.error);
