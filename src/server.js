import Express from "express";
import authorRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogPosts/index.js";
import errorHandler from "./errorHandler.js";
import cors from "cors";

const server = Express();

const port = 3001;

server.use(Express.json());
server.use(cors());

server.use("/authors", authorRouter);
server.use("/blogPosts", blogPostsRouter);

server.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
