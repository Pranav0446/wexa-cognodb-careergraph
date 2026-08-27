const express = require("express");

const router = express.Router();

module.exports = (driver) => {
  router.get("/:userName", async (req, res) => {
    const session = driver.session();

    try {
      const result = await session.run(
        `
        MATCH (u:User {name: $userName})
              -[:HAS_SKILL]->(skill:Skill)
              -[:RELATED_TO]->(relatedSkill:Skill)
              <-[:REQUIRES]-(job:Job)
        MATCH (job)-[:OFFERED_BY]->(company:Company)
        MATCH (job)-[:IN_CATEGORY]->(category:Category)

        RETURN DISTINCT
          job.title AS title,
          company.name AS company,
          category.name AS category,
          skill.name AS matchedSkill,
          relatedSkill.name AS relatedSkill

        ORDER BY job.title
        `,
        {
          userName: req.params.userName
        }
      );

      const recommendations = result.records.map((record) => ({
        title: record.get("title"),
        company: record.get("company"),
        category: record.get("category"),
        matchedSkill: record.get("matchedSkill"),
        relatedSkill: record.get("relatedSkill")
      }));

      res.json({
        success: true,
        recommendations
      });
    } catch (error) {
      console.error(
        "Recommendation API error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to generate recommendations"
      });
    } finally {
      await session.close();
    }
  });

  return router;
};