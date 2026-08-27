import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [stats, setStats] = useState([]);
const [jobs, setJobs] = useState([]);
const [recommendations, setRecommendations] = useState([]);
const [skillSearch, setSkillSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [graphData, setGraphData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
  fetchStats();
  fetchJobs();
  fetchRecommendations();
  fetchGraphData();
}, []);
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/graph-stats"
      );

      setStats(response.data.stats);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

    const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(response.data.jobs);
    } catch (err) {
      console.error(err);
      setError("Unable to load jobs.");
    }
  };

    const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/recommendations/Pranav%20Rao"
      );

      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchGraphData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/graph/Pranav%20Rao"
    );

    setGraphData(response.data.graph);
  } catch (err) {
    console.error(err);
  }
};

  const searchJobsBySkill = async () => {
  if (!skillSearch.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/api/jobs/skill/${encodeURIComponent(
        skillSearch
      )}`
    );

    setSearchResults(response.data.jobs);
  } catch (err) {
    console.error(err);
    setError("Unable to search jobs.");
  }
};

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          CareerGraph
        </div>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#jobs">Jobs</a>
          <a href="#skills">Skills</a>
          <a href="#recommendations">Recommendations</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="dashboard">
          <div>
            <p className="eyebrow">GRAPH-POWERED CAREER EXPLORATION</p>

            <h1>
              Discover jobs through your
              <span> skills and connections.</span>
            </h1>

            <p className="hero-text">
              Explore career opportunities by understanding how your
              skills connect to related technologies, jobs and companies.
            </p>

            <div className="hero-buttons">
              <button onClick={() => {
                document
                  .getElementById("recommendations")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}>
                View Recommendations
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  document
                    .getElementById("jobs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Jobs
              </button>
            </div>
          </div>

          <div className="graph-card">
            <div className="graph-title">Your Career Graph</div>

            <div className="graph">
              <div className="node node-user">You</div>
              <div className="line line-one"></div>
              <div className="node node-skill">React</div>
              <div className="line line-two"></div>
              <div className="node node-job">Frontend Developer</div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="section-heading">
            <p className="eyebrow">DATABASE OVERVIEW</p>
            <h2>Our career graph</h2>
          </div>

          {loading && (
            <div className="state-card">
              Loading graph data...
            </div>
          )}

          {error && (
            <div className="state-card error-card">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="stats-grid">
              {stats.map((item) => (
                <div className="stat-card" key={item.type[0]}>
                  <span>{item.type[0]}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="content-section" id="jobs">
          <div className="section-heading">
            <p className="eyebrow">EXPLORE</p>
            <h2>Career opportunities</h2>
            <p>
              Jobs are connected to the skills and categories they require.
            </p>
          </div>
<div className="skill-search">
  <input
    type="text"
    placeholder="Search jobs by skill... e.g. React"
    value={skillSearch}
    onChange={(e) => setSkillSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        searchJobsBySkill();
      }
    }}
  />

  <button onClick={searchJobsBySkill}>
    Search
  </button>
</div>

{searchResults.length > 0 && (
  <div className="search-results">
    <h3>Jobs matching "{skillSearch}"</h3>

    <div className="job-grid">
      {searchResults.map((job) => (
        <div className="job-card" key={job.title}>
          <div className="job-icon">
            {job.title.substring(0, 2).toUpperCase()}
          </div>

          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.category}</p>

          <div className="skills">
            {job.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
{skillSearch.trim() && searchResults.length === 0 && (
  <div className="state-card">
    No jobs found for "{skillSearch}".
  </div>
)}
          <div className="job-grid">
  {jobs.map((job) => (
    <div className="job-card" key={job.title}>
      <div className="job-icon">
        {job.title.substring(0, 2).toUpperCase()}
      </div>

      <h3>{job.title}</h3>

      <p>{job.company}</p>

      <p>{job.category}</p>

      <div className="skills">
        {job.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  ))}
</div>
        </section>
        <section className="graph-section" id="skills">
  <div className="section-heading">
    <p className="eyebrow">GRAPH MODEL</p>
    <h2>How the career graph works</h2>
    <p>
      Career opportunities are connected through skills,
      related skills, companies and categories.
    </p>
  </div>

  <div className="graph-model">
  <div className="graph-node user-node">
    <span>User</span>
    <strong>{graphData?.user || "Pranav Rao"}</strong>
  </div>

  <div className="graph-arrow">→</div>

  <div className="graph-node">
    <span>Skills</span>
    <strong>
      {graphData?.skills?.length || 0} skills
    </strong>
  </div>

  <div className="graph-arrow">→</div>

  <div className="graph-node">
    <span>Jobs</span>
    <strong>
      {graphData?.jobs?.length || 0} jobs
    </strong>
  </div>

  <div className="graph-arrow">→</div>

  <div className="graph-node">
    <span>Companies</span>
    <strong>
      {graphData?.companies?.length || 0} companies
    </strong>
  </div>
</div>

  <div className="graph-description">
  <p>
    User <strong>HAS_SKILL</strong> → Skill
  </p>

  <p>
    Skill <strong>REQUIRES</strong> → Job
  </p>

  <p>
    Job <strong>OFFERED_BY</strong> → Company
  </p>

  {graphData?.relatedSkills?.length > 0 && (
    <p>
      Skill <strong>RELATED_TO</strong> → Related Skill
    </p>
  )}
</div>
</section>

        <section
          className="recommendation-section"
          id="recommendations"
        >
          <div>
            <p className="eyebrow">GRAPH RECOMMENDATION</p>

            <h2>Find your next opportunity</h2>

            <p>
              Your skills can lead to jobs through direct requirements
              and related skills. This is where the graph database
              becomes useful.
            </p>
          </div>

          <div className="recommendation-card">
  <span>Recommended for Pranav</span>

  {recommendations.length > 0 ? (
  Object.values(
    recommendations.reduce((groups, recommendation) => {
      if (!groups[recommendation.title]) {
        groups[recommendation.title] = {
          title: recommendation.title,
          company: recommendation.company,
          category: recommendation.category,
          connections: []
        };
      }

      groups[recommendation.title].connections.push({
        matchedSkill: recommendation.matchedSkill,
        relatedSkill: recommendation.relatedSkill
      });

      return groups;
    }, {})
  ).map((job) => (
    <div key={job.title}>
      <h3>{job.title}</h3>

      <p>
        {job.company} • {job.category}
      </p>

      {job.connections.map((connection, index) => (
        <p key={index}>
          <strong>{connection.matchedSkill}</strong>
          {" → "}
          <strong>{connection.relatedSkill}</strong>
        </p>
      ))}
    </div>
  ))
) : (
  <p>No recommendations found.</p>
)}
</div>
        </section>
      </main>

      <footer>
        <p>CareerGraph • Powered by CognoDB</p>
      </footer>
    </div>
  );
}

export default App;