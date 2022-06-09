const express = require("express");
const axios = require("axios");

const app = express();

const splitFunc = (param) => {
  return param.split(",");
};

const hashedLst = (lst) => {
  let hashed = [];
  let alreadySeen = [];
  lst.forEach((item) => {
    if (!(item.id in alreadySeen)) {
      hashed.push(item);
      alreadySeen.push(item.id);
    }
  });
  return hashed;
};

app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true });
});

app.get("/api/posts", (req, res) => {
  const queryParam = req.query;
  let respLst = [];

  if (!queryParam.tag) {
    return res.status(400).json({ error: "Tags parameter is required" });
  }

  const lstTags = splitFunc(queryParam.tag);

  axios
    .all(
      lstTags.map((indivtag) =>
        axios.get(
          `https://api.hatchways.io/assessment/blog/posts?tag=${indivtag}`
        )
      )
    )
    .then((resp) => {
      resp.forEach((post) => {
        respLst = [...respLst, ...post.data.posts];
      });

      const finalLst = hashedLst(respLst);

      res.status(200).json(finalLst);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(8000, () => console.log("Listening on port 8000"));
