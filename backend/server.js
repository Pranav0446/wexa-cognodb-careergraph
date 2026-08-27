const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const neo4j = require("neo4j-driver");
const jobsRouter = require("./routes/jobs");
const recommendationsRouter = require("./routes/recommendations");
const graphRouter = require("./routes/graph");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME,
    process.env.COGNODB_PASSWORD
  )
);
app.use("/api/jobs", jobsRouter(driver));
app.use("/api/graph", graphRouter(driver));
app.use(
  "/api/recommendations",
  recommendationsRouter(driver)
);

app.get("/", (req, res) => {
  res.json({
    message: "Wexa AI CognoDB backend is running"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const session = driver.session();

    const result = await session.run(
      "RETURN 'CognoDB connection successful!' AS message"
    );

    await session.close();

    res.json({
      success: true,
      message: result.records[0].get("message")
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to connect to CognoDB"
    });
  }
});

app.get("/api/graph-stats", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)
      RETURN labels(n) AS type, count(n) AS count
      ORDER BY type
    `);

    const stats = result.records.map((record) => ({
      type: record.get("type"),
      count: record.get("count").toNumber()
    }));

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Graph stats error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve graph statistics"
    });
  } finally {
    await session.close();
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});