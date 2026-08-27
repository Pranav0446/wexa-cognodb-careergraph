const dotenv = require("dotenv");
const neo4j = require("neo4j-driver");

dotenv.config();

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME,
    process.env.COGNODB_PASSWORD
  )
);

const users = [
  {
    name: "Pranav Rao",
    email: "pranav@example.com"
  },
  {
    name: "Ananya Sharma",
    email: "ananya@example.com"
  },
  {
    name: "Rahul Kumar",
    email: "rahul@example.com"
  }
];

const skills = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "MongoDB",
  "Machine Learning",
  "Git"
];

const companies = [
  "Microsoft",
  "Google",
  "Amazon",
  "TCS",
  "Infosys"
];

const categories = [
  "Web Development",
  "Backend Development",
  "Data Science",
  "Machine Learning"
];

const jobs = [
  {
    title: "Frontend Developer",
    company: "Microsoft",
    category: "Web Development",
    skills: ["JavaScript", "React", "Git"]
  },
  {
    title: "Backend Developer",
    company: "Amazon",
    category: "Backend Development",
    skills: ["Node.js", "JavaScript", "SQL", "Git"]
  },
  {
    title: "Python Developer",
    company: "Infosys",
    category: "Backend Development",
    skills: ["Python", "SQL", "Git"]
  },
  {
    title: "Data Scientist",
    company: "Google",
    category: "Data Science",
    skills: ["Python", "SQL", "Machine Learning"]
  },
  {
    title: "Machine Learning Engineer",
    company: "TCS",
    category: "Machine Learning",
    skills: ["Python", "Machine Learning", "SQL"]
  }
];

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing database...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating users...");

    await session.run(
      `
      UNWIND $users AS user
      CREATE (:User {
        name: user.name,
        email: user.email
      })
      `,
      { users }
    );

    console.log("Creating skills...");

    await session.run(
      `
      UNWIND $skills AS skill
      CREATE (:Skill {
        name: skill
      })
      `,
      { skills }
    );

    console.log("Creating companies...");

    await session.run(
      `
      UNWIND $companies AS company
      CREATE (:Company {
        name: company
      })
      `,
      { companies }
    );

    console.log("Creating categories...");

    await session.run(
      `
      UNWIND $categories AS category
      CREATE (:Category {
        name: category
      })
      `,
      { categories }
    );

    console.log("Creating jobs and relationships...");

    for (const job of jobs) {
      await session.run(
        `
        MATCH (company:Company {name: $company})
        MATCH (category:Category {name: $category})

        CREATE (job:Job {
          title: $title
        })

        CREATE (job)-[:OFFERED_BY]->(company)
        CREATE (job)-[:IN_CATEGORY]->(category)

        WITH job
        UNWIND $skills AS skillName
        MATCH (skill:Skill {name: skillName})
        CREATE (job)-[:REQUIRES]->(skill)
        `,
        {
          title: job.title,
          company: job.company,
          category: job.category,
          skills: job.skills
        }
      );
    }

    console.log("Creating user skill relationships...");

    await session.run(`
      MATCH (u:User {name: "Pranav Rao"})
      MATCH (s:Skill {name: "JavaScript"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (s:Skill {name: "React"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (s:Skill {name: "Node.js"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (c:Category {name: "Web Development"})
      CREATE (u)-[:INTERESTED_IN]->(c)
    `);

    await session.run(`
      MATCH (u:User {name: "Ananya Sharma"})
      MATCH (s:Skill {name: "Python"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (s:Skill {name: "Machine Learning"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (c:Category {name: "Machine Learning"})
      CREATE (u)-[:INTERESTED_IN]->(c)
    `);

    await session.run(`
      MATCH (u:User {name: "Rahul Kumar"})
      MATCH (s:Skill {name: "SQL"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (s:Skill {name: "Python"})
      CREATE (u)-[:HAS_SKILL]->(s)

      WITH u
      MATCH (c:Category {name: "Data Science"})
      CREATE (u)-[:INTERESTED_IN]->(c)
    `);

    console.log("Creating skill relationships...");

    await session.run(`
      MATCH (javascript:Skill {name: "JavaScript"})
      MATCH (react:Skill {name: "React"})
      CREATE (javascript)-[:RELATED_TO]->(react)

      WITH javascript, react
      MATCH (node:Skill {name: "Node.js"})
      CREATE (javascript)-[:RELATED_TO]->(node)

      WITH react
      MATCH (git:Skill {name: "Git"})
      CREATE (react)-[:RELATED_TO]->(git)
    `);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();