import cors from 'cors';
import express from 'express';
import { compile, publish } from './compile';
import { getObjectDetails, getPackageDetails } from './object-details';

const app = express();
const portHttp = 5002;
const portHttps = 5001;

// PRODUCTION
import https from 'https';
import fs from 'fs';
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(443, () => {
	console.log('HTTP Server running on port 443');
});


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

  // console.log(project);
  console.log('compiling project...')

  // Call compile function
  const compileResult = await compile(project);

  // console.log(compileResult)

  res.send(compileResult);

});

app.post('/publish', async (req, res) => {
  const compiledModules = req.body.compiledModules;

  // console.log(compiledModules);
  console.log('publishing modules...')

  // Call compile function
  const compileResult = await publish(compiledModules);

  res.send(compileResult);

});

app.post('/object-details', async (req, res) => {
  const objectId = req.body.objectId as string;

  console.log('Retrieving object details for: ' + objectId)

  // console.log(objectId);

  const objectDetails = await getObjectDetails(objectId);

  // console.log(objectDetails);

  res.send(objectDetails);
});

app.post('/package-details', async (req, res) => {
  const packageId = req.body.packageId as string;

  // console.log(packageId);
  console.log('Retrieving package details for: ' + packageId)

  const packageDetails = await getPackageDetails(packageId);

  // console.log(packageDetails);

  res.send(packageDetails);
});

app.listen(process.env.PORT || portHttp, () => {
  console.log(`REST API is listening on port: ${process.env.PORT || portHttp}.`);
});