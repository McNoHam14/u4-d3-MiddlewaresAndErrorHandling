import Express from "express";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import fs from "fs";

const authorsFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
// console.log(authorsFilePath);

const authorRouter = Express.Router();

authorRouter.get("/", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsFilePath));
  // console.log(authorsArray);
  // res.json("Hello world!");
  res.json(authorsArray);
});

authorRouter.post("/", (req, res) => {
  // res.json("Hello wold!");
  console.log(req.body);

  // read array from file, store in array, store array back to file
  const authorsArray = JSON.parse(fs.readFileSync(authorsFilePath));
  req.body.id = authorsArray.length;
  authorsArray.push(req.body);
  fs.writeFileSync(authorsFilePath, JSON.stringify(authorsArray));
  res.json(req.body.name);
});

authorRouter.get("/:id", (req, res) => {
  // console.log(req.params.id);
  const authorId = Number(req.params.id);

  const authorsArray = JSON.parse(fs.readFileSync(authorsFilePath));

  const foundAuthor = authorsArray.find((author) => {
    if (author.id === authorId) {
      return true;
    }
  });

  // res.json("Hello world!");
  res.json(foundAuthor);
});

authorRouter.delete("/:id", (req, res) => {
  // read array from file, delete from array, store array back to file
  const authorId = Number(req.params.id);
  const authorsArray = JSON.parse(fs.readFileSync(authorsFilePath));
  const newAuthorsArray = authorsArray.filter((author) => {
    if (author.id !== authorId) {
      return true;
    }
  });
  fs.writeFileSync(authorsFilePath, JSON.stringify(newAuthorsArray));
  res.json("Author is deleted");
});

// PUT
// similar to get single author need to update file with
// read array from file, find item from array, update the item, store array back to file

authorRouter.put("/:id", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsFilePath));

  const index = authorsArray.findIndex((author) => author.id === req.params.id);
  const unchangedAuthor = authorsArray[index];
  const changedAuthor = { ...unchangedAuthor, ...req.body };
  authorsArray[index] = changedAuthor;

  fs.writeFileSync(authorsFilePath, JSON.stringify(authorsArray));

  res.json(changedAuthor);
});

export default authorRouter;
