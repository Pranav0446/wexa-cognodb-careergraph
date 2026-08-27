const express = require("express");
const {
  GET_ALL_JOBS,
  FIND_JOBS_BY_SKILL
} = require("../queries/careerQueries");

const router = express.Router();

module.exports = (driver) => {
  // Get all jobs
  router.get("/", async (req, res) => {
    const session = driver.session();

    try {
      const result = await session.run(GET_ALL_JOBS);

      const jobs = result.records.map((record) => ({
        title: record.get("title"),
        company: record.get("company"),
        category: record.get("category"),
        skills: record.get("skills")
      }));

      res.json({
        success: true,
        jobs
      });
    } catch (error) {
      console.error("Jobs API error:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to retrieve jobs"
      });
    } finally {
      await session.close();
    }
  });

  // Search jobs by skill
  router.get("/skill/:skillName", async (req, res) => {
    const session = driver.session();

    try {
      const result = await session.run(
  FIND_JOBS_BY_SKILL,
  {
    skillName: req.params.skillName
  }
);

      const jobs = result.records.map((record) => ({
        title: record.get("title"),
        company: record.get("company"),
        category: record.get("category"),
        skills: record.get("skills")
      }));

      res.json({
        success: true,
        jobs
      });
    } catch (error) {
      console.error("Skill search error:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to search jobs"
      });
    } finally {
      await session.close();
    }
  });

  return router;
};