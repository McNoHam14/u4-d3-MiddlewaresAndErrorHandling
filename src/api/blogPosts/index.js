import Express from "express";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import fs from "fs";

const blogPostsFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);
// console.log(blogPostsFilePath);

const blogPostsRouter = Express.Router();

blogPostsRouter.get("/", (req, res) => {
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsFilePath));
  // console.log(blogPostsArray);
  // res.json("Hello world!");
  res.json(blogPostsArray);
});

blogPostsRouter.post("/", (req, res) => {
  // res.json("Hello wold!");
  // console.log(req.body);
  if (!req.body.title) {
    // res.status(400).json("Please enter the title");
    next({ status: 400, message: "Enter the title" });
    return;
  }

  // read array from file, store in array, store array back to file
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsFilePath));
  req.body.id = blogPostsArray.length;
  blogPostsArray.push(req.body);
  fs.writeFileSync(blogPostsFilePath, JSON.stringify(blogPostsArray));
  res.json({ id: req.body.id, title: req.body.title });
});

blogPostsRouter.get("/:id", (req, res) => {
  // console.log(req.params.id);
  const blogPostId = Number(req.params.id);

  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsFilePath));

  const foundBlogPost = blogPostsArray.find((blogPost) => {
    if (blogPost.id === blogPostId) {
      return true;
    }
  });
  if (!foundBlogPost) {
    // res.status(404).json("This post does not exist");
    next({ status: 404, message: "Post does not exist" });
    return;
  }

  // res.json("Hello world!");
  res.json(foundBlogPost);
});

blogPostsRouter.delete("/:id", (req, res, next) => {
  // read array from file, delete from array, store array back to file
  const blogPostId = Number(req.params.id);
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsFilePath));
  const newblogPostsArray = blogPostsArray.filter((blogPost) => {
    if (blogPost.id !== blogPostId) {
      return true;
    }
  });
  if (blogPostsArray.length === newblogPostsArray.length) {
    // res.status(404).json("There is no post to delete");
    next({ status: 404, message: "No post to delete" });
    return;
  }
  fs.writeFileSync(blogPostsFilePath, JSON.stringify(newblogPostsArray));
  res.json("blogPost is deleted");
});

// PUT
// similar to get single blogPost need to update file with
// read array from file, find item from array, update the item, store array back to file

blogPostsRouter.put("/:id", (req, res) => {
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsFilePath));

  const index = blogPostsArray.findIndex(
    (blogPost) => blogPost.id === req.params.id
  );
  const unchangedBlogPost = blogPostsArray[index];
  const changedBlogPost = { ...unchangedBlogPost, ...req.body };
  blogPostsArray[index] = changedBlogPost;

  fs.writeFileSync(blogPostsFilePath, JSON.stringify(blogPostsArray));

  res.json(changedBlogPost);
});

export default blogPostsRouter;
