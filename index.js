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

const bubbleSort = (lst, param) => {
  if (param === "id") {
    for (let i = 0; i < lst.length; i++) {
      for (let j = 0; j < lst.length - 1; j++) {
        if (lst[j].id > lst[j + 1].id) {
          let temp = lst[j];
          lst[j] = lst[j + 1];
          lst[j + 1] = temp;
        }
      }
    }
  } else if (param === "likes") {
    for (let i = 0; i < lst.length; i++) {
      for (let j = 0; j < lst.length - 1; j++) {
        if (lst[j].likes > lst[j + 1].likes) {
          let temp = lst[j];
          lst[j] = lst[j + 1];
          lst[j + 1] = temp;
        }
      }
    }
  } else if (param === "reads") {
    for (let i = 0; i < lst.length; i++) {
      for (let j = 0; j < lst.length - 1; j++) {
        if (lst[j].reads > lst[j + 1].reads) {
          let temp = lst[j];
          lst[j] = lst[j + 1];
          lst[j + 1] = temp;
        }
      }
    }
  } else if (param === "popularity") {
    for (let i = 0; i < lst.length; i++) {
      for (let j = 0; j < lst.length - 1; j++) {
        if (lst[j].popularity > lst[j + 1].popularity) {
          let temp = lst[j];
          lst[j] = lst[j + 1];
          lst[j + 1] = temp;
        }
      }
    }
  }

  return lst;
};

app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true });
});

app.get("/api/posts", (req, res) => {
  const queryParam = req.query;

  const sortByLst = ["id", "reads", "likes", "popularity"];
  const directionLst = ["asc", "desc"];
  let respLst = [];

  if (!queryParam.tag) {
    return res.status(400).json({ error: "Tags parameter is required" });
  }

  // if (!(queryParam.sortBy in sortByLst)) {
  //   return res.status(400).json({ error: "sortBy parameter is invalid" });
  // }

  if (queryParam.direction in directionLst) {
    return res.status(400).json({ error: "direction parameter is invalid" });
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

      let finalLst = bubbleSort(hashedLst(respLst), "id");

      if (queryParam.sortBy && queryParam.sortBy === "likes") {
        finalLst = bubbleSort(hashedLst(respLst), "likes");
      } else if (queryParam.sortBy && queryParam.sortBy === "reads") {
        finalLst = bubbleSort(hashedLst(respLst), "reads");
      } else if (queryParam.sortBy && queryParam.sortBy === "popularity") {
        finalLst = bubbleSort(hashedLst(respLst), "popularity");
      }

      res.status(200).json(finalLst);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(8000, () => console.log("Listening on port 8000"));
