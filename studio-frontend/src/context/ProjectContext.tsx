import React, { useEffect, useState, createContext } from 'react';
import { Project } from '../types/project-types';

interface ProjectContextInterface {
  projectList: string[],
  currentProject: Project | null,
  // setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>
}



const ProjectContext = createContext<ProjectContextInterface>({} as ProjectContextInterface);

export default ProjectContext;