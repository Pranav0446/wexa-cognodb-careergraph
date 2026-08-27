const express = require("express");

const {
  GET_USER_GRAPH
} = require("../queries/careerQueries");

const router = express.Router();

module.exports = (driver) => {
  router.get("/:userName", async (req, res) => {
    const session = driver.session();

    try {
      const result = await session.run(
        GET_USER_GRAPH,
        {
          userName: req.params.userName
        }
      );

      if (result.records.length === 0) {
        return res.json({
          success: true,
          graph: null
        });
      }

      const record = result.records[0];

      res.json({
        success: true,
        graph: {
          user: record.get("user"),
          skills: record.get("skills"),
          relatedSkills: record.get("relatedSkills"),
          jobs: record.get("jobs"),
          companies: record.get("companies")
        }
      });
    } catch (error) {
      console.error("Graph API error:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to retrieve graph data"
      });
    } finally {
      await session.close();
    }
  });

  return router;
};