const GET_ALL_JOBS = `
  MATCH (job:Job)-[:OFFERED_BY]->(company:Company)
  MATCH (job)-[:IN_CATEGORY]->(category:Category)
  OPTIONAL MATCH (job)-[:REQUIRES]->(skill:Skill)

  RETURN
    job.title AS title,
    company.name AS company,
    category.name AS category,
    collect(skill.name) AS skills

  ORDER BY job.title
`;

const FIND_JOBS_BY_SKILL = `
  MATCH (job:Job)-[:REQUIRES]->(skill:Skill)
  MATCH (job)-[:OFFERED_BY]->(company:Company)
  MATCH (job)-[:IN_CATEGORY]->(category:Category)

  WHERE toLower(skill.name) = toLower($skillName)

  RETURN
    job.title AS title,
    company.name AS company,
    category.name AS category,
    collect(skill.name) AS skills

  ORDER BY job.title
`;

const GET_RECOMMENDATIONS = `
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
`;

const GET_USER_GRAPH = `
  MATCH (u:User {name: $userName})-[:HAS_SKILL]->(skill:Skill)
  OPTIONAL MATCH (skill)-[:RELATED_TO]->(relatedSkill:Skill)
  OPTIONAL MATCH (job:Job)-[:REQUIRES]->(skill)
  OPTIONAL MATCH (job)-[:OFFERED_BY]->(company:Company)

  RETURN
    u.name AS user,
    collect(DISTINCT skill.name) AS skills,
    collect(DISTINCT relatedSkill.name) AS relatedSkills,
    collect(DISTINCT job.title) AS jobs,
    collect(DISTINCT company.name) AS companies
`;
module.exports = {
  GET_ALL_JOBS,
  FIND_JOBS_BY_SKILL,
  GET_RECOMMENDATIONS,
  GET_USER_GRAPH
};