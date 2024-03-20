import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';

const withRouter = WrappedComponent => props => {
    const location = useLocation();

    return (
        <WrappedComponent {...props} location={location}/>
    )
}

class Navbar extends Component {
    render() {
        if(this.props.location.pathname === '/login' || this.props.location.pathname === '/register'){
            return null;
        }
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to={`/${this.props.token}/projects`} className="navbar-brand">Project Manager</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to={`/${this.props.token}/projects`} className="nav-link">Projects</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to={`/${this.props.token}/create-project`} className="nav-link">Create Project</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to={`/${this.props.token}/create-task`} className="nav-link">Create Task</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to={`/${this.props.token}/users`} className="nav-link">User List</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar);