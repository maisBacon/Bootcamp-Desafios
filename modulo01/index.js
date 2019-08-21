const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let numberRequests = 0;

function log(req, res, next) {
  console.time = "Request";
  console.log(`Metodo ${req.method} URL ${req.url}`);
  next();
  console.timeEnd("Request");
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(x => x.id == id);
  if (!project) {
    return res.status(400).json({ error: "Não encontrado" });
  }
  return next();
}

function logRequest(req, res, next) {
  numberRequests++;
  console.log(`Número de requisições ${numberRequests}`);
  return next();
}

server.use(logRequest);
server.use(log);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(x => x.id == id);
  project.title = title;
  return res.json(project);
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(x => x.id == id);
  project.tasks.push(title);
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(x => x.id == id);
  projects.splice(project, 1);
  return res.json(project);
});

server.listen(3333);
