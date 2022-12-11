import cors from 'cors';
import express from 'express';
import { appendFileSync } from 'fs';
import { resetLevel } from 'loglevel';
import { compile, publish } from './compile';
import { getProjectsOfAddress } from './gets';
import { getObjectDetails } from './object-details';
import { Project } from './schema/user-schema';

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/projects', (req, res) => {
  res.send('projects');
});

// app.get('/projects/:address', (req, res) => {
//   const address = req.params.address as string;

//   // Get projects for address
//   const projects = getProjectsOfAddress(address);

//   res.send(projects);
// });

app.post('/compile', async (req, res) => {
  const project = req.body;

  console.log(project);

  // Call compile function
  const compileResult = await compile(project);

  res.send(compileResult);

});

app.post('/publish', async (req, res) => {
  const compiledModules = req.body.compiledModules;

  console.log(compiledModules);

  // Call compile function
  const compileResult = await publish(compiledModules);

  res.send(compileResult);

});

app.post('/object-details', async (req, res) => {
  const objectId = req.body.objectId as string;

  console.log(objectId);

  const objectDetails = await getObjectDetails(objectId);

  console.log(objectDetails);

  res.send(objectDetails);
});

app.listen(process.env.PORT || port, () => {
  console.log(`REST API is listening on port: ${process.env.PORT || port}.`);
});