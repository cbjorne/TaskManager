import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent params={params}/>
    )
}

const Project = props => {
    function deleteProject() {
        axios.delete(`http://localhost:5000/${props.token}/project/${props.project._id}`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else{
                window.location = `/${props.token}/projects`;
            }
        });
    }

    return (
        <tr>
            <td>{props.project.name}</td>
            <td>
                <Link to={`/${props.token}/project-tasks/${props.project._id}`}>View</Link> | <a href="#" onClick={deleteProject}>Delete</a>
            </td>
        </tr>
    )
}

class ProjectList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/project/`)
        .then(res => {
            if(res.data.status) {
                this.setState({
                    projects: res.data.projects
                });
            }
            else {
                window.location = '/login';
            }
        })
        .catch(err => console.log(err));
    }

    projectList() {
        return this.state.projects.map(currentProject => {
            return <Project token={this.props.params.token} project={currentProject} key={currentProject._id}/>;
        });
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>Project List</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.projectList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(ProjectList);