import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/login.component';
import Register from './components/register.component';
import CreateTask from './components/create-task.component';
import UpdateTask from './components/update-task.component';
import DeleteUser from './components/delete-user.component';
import Users from './components/userlist.component';
import CreateProject from './components/create-project.component';
import ProjectList from './components/projectlist.component';
import ProjectTaskList from './components/project-tasks.component';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:token/projects" element={<ProjectList/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/:token/create-task" element={<CreateTask/>}/>
        <Route path="/:token/:projectid/update-task/:taskid" element={<UpdateTask/>}/>
        <Route path="/:token/delete-user/:id" element={<DeleteUser/>}/>
        <Route path="/:token/users" element={<Users/>}/>
        <Route path="/:token/create-project" element={<CreateProject/>}/>
        <Route path="/:token/project-tasks/:id" element={<ProjectTaskList/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

