import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = (props) => {
    const location = useLocation();

    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <Link to={`/${props.token}/projects`} className="navbar-brand">Project Manager</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <Link to={`/${props.token}/projects`} className="nav-link">Projects</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to={`/${props.token}/create-project`} className="nav-link">Create Project</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to={`/${props.token}/create-task`} className="nav-link">Create Task</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to={`/${props.token}/users`} className="nav-link">User List</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;