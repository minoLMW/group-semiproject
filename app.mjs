import express from "express";
import authRouter from "./src/router/auth.mjs";
import postsRouter from "./src/router/post.mjs";
import icecreamsRouter from "./src/router/icecream.mjs";
import cartsRouter from "./src/router/cart.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./src/db/database.mjs";

const app = express();

app.use(express.json());

// app.use(express.static(path.join(process.cwd(), "html")));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/icecreams", icecreamsRouter);
app.use("/carts", cartsRouter);

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
