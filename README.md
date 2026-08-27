# CareerGraph — CognoDB Graph Database Application

CareerGraph is a graph-powered career exploration web application built for the Wexa AI CognoDB take-home assignment.

The application connects users, skills, related skills, jobs, companies and job categories using a graph database. Users can explore career opportunities and search for jobs based on their skills.

## Features

- Explore career opportunities
- Search jobs by skill
- View graph database statistics
- Get graph-based career recommendations
- Explore relationships between users, skills, jobs and companies
- Multi-hop graph traversal using Cypher
- Loading and error states
- Responsive web interface
- CognoDB integration using the official Neo4j driver

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Neo4j JavaScript Driver

### Database

- CognoDB Cloud
- openCypher
- Bolt protocol

## Why a Graph Database?

Career data is naturally relationship-heavy.

A user can have multiple skills, skills can be related to other skills, jobs require multiple skills, jobs belong to categories, and companies offer different jobs.

A graph database makes these relationships easy to model and traverse.

For example:

User → Skill → Related Skill → Job → Company

This type of multi-hop relationship is more natural to query using a graph database than repeatedly joining multiple relational tables.

## Graph Data Model

The main entities in the application are:

- User
- Skill
- Job
- Company
- Category

Main relationships include:

- User -[:HAS_SKILL]-> Skill
- Skill -[:RELATED_TO]-> Skill
- Skill -[:REQUIRES]-> Job
- Job -[:OFFERED_BY]-> Company
- Job -[:IN_CATEGORY]-> Category

Example graph:

User
↓
HAS_SKILL
↓
Skill
↓
RELATED_TO
↓
Related Skill
↓
REQUIRES
↓
Job
↓
OFFERED_BY
↓
Company

## Main Graph Queries

### Get all jobs

Retrieves jobs together with their company, category and required skills.

### Search jobs by skill

The application accepts a skill as a parameter and finds jobs requiring that skill.

Example:

React → Frontend Developer

### Career recommendations

The recommendation query performs a multi-hop traversal:

User → Skill → Related Skill → Job → Company

This allows the application to find opportunities through related skills rather than only direct skill matches.

## Project Structure

```text
wexa-cognodb-assignment/
│
├── backend/
│   ├── queries/
│   │   └── careerQueries.js
│   │
│   ├── routes/
│   │   ├── graph.js
│   │   ├── jobs.js
│   │   └── recommendations.js
│   │
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md