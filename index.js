const express = require('express');

const server = express();

server.use(express.json());

let contReq = 0;

server.use((req, res, next) => {
  contReq++;
  console.log(contReq);
  return next();
});

const projects = [];

function checkId(req, res, next) {
  const { id } = req.params;
  const idProject = projects.findIndex(findProject => findProject.id == id);
  if (idProject < 0) {
    return res.status(400).json({ error: 'Id not found' });
  }
  req.idProject = idProject;
  return next();
}

function checkIdExist(req, res, next) {
  const { id } = req.body;
  const idProject = projects.findIndex(findProject => findProject.id == id);
  if (idProject >= 0) {
    return res.status(400).json({ error: 'Id already used' });
  }
  return next();
}

//get de todos os projetos
server.get('/projects', (req, res) => {
  return res.send(projects);
});

//POST para criar um novo projeto
server.post('/projects', checkIdExist, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.send(projects);
});

//PUT para alterar o titulo de um projeto existente
server.put('/projects/:id', checkId, (req, res) => {
  const { title } = req.body;
  const id = req.idProject;
  projects[id].title = title;
  return res.send(projects);
});

//DELETE deleta o projeto que tem aquele id
server.delete('/projects/:id', checkId, (req, res) => {
  const id = req.idProject;
  // findIndex ficará fazendo a comparação até ela ser true, quando
  // true ela retorna o index que faz dela true
  // const index = projects.findIndex(findProject => findProject.id === id);
  projects.splice(id, 1);
  return res.send(projects);
});

//ADD adiciona uma nova tarefa no projeto
server.post('/projects/:id/tasks', checkId, (req, res) => {
  const id = req.idProject;
  const { title } = req.body;

  // const index = projects.findIndex(project => project.id === id);
  projects[id].tasks.push(title);

  return res.send(projects[id]);
});

server.listen(3000);
