import fs from 'fs';

export function getProjectsOfAddress (address: string): string[] {

  const projects = fs.readdirSync(`./users/${address}`, 'utf8');

  console.log(projects);

  return projects;
}