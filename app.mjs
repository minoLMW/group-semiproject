import express from "express";
import authRouter from "./src/router/auth.mjs";
import postsRouter from "./src/router/post.mjs";
import icecreamsRouter from "./src/router/icecream.mjs";
import cartsRouter from "./src/router/cart.mjs";
import gameRouter from "./src/router/game.mjs"
import { config } from "./config.mjs";
import { connectDB } from "./src/db/database.mjs";
import {dirname} from "path"
import { fileURLToPath } from "url";
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.static("html"));
app.use(express.json());
// app.use(cors());
app.get("/", (req, res) => {
  fs.readFile(__dirname + "/html/main/index.html", (err, data) => {
    if (err) {
      res.status(500);
      return res.send("파일 읽기 오류");
    }
    res.status(200).set({ "Content-Type": "text/html" });
    res.send(data);
  });
});

// const app = express();
// app.use(express.json());
// app.use(express.static(path.join(process.cwd(), "html")));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/icecreams", icecreamsRouter);
app.use("/carts", cartsRouter);
app.use("/game",gameRouter)

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
