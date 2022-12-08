import fs from 'fs';
import { Module } from '../types/ProjectTypes';


export function getModulesInPackage(address: string, packageName: string): Module[] {
  const filesInPackage = fs.readdirSync(`./users/${address}/${packageName}`, 'utf8');
  let modules: Module[] = [];
  for(const file of filesInPackage) {
    if (file.endsWith('.move')) {
      const module: Module = {
        name: file.split('.move')[0],
        code: fs.readFileSync(`./users/${address}/${packageName}/${file}`, 'utf8')
      }
      modules.push(module);
    }
  }
  return modules;
}