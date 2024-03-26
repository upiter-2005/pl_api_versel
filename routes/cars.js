const express = require("express");
const router = express.Router();


const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_25vpw8yGhx65kMyFtWUNUUzsxz23TYjicwelIDjpjk0" });
const databaswId = "b2e2e644b4a046819fa39e12e0630293";


router.get("/", async (req, res, next) => {

  try {
    const data = await notion.databases.query({
      database_id: databaswId,
      sorts: [
        {
          property: "Name", 
          direction: "ascending",
        },
      ],
    });

 
 
    return res.json({ data });


  } catch (e) {
    return res.json({ message: "Not denie" });
  }
});

module.exports = router;
