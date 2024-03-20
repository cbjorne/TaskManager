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

const Task = props => {
    const params = useParams();
    function deleteTask() {
        axios.delete(`http://localhost:5000/${props.token}/project/${params.id}/delete/${props.task._id}`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else{
                window.location = `/${props.token}/project-tasks/${params.id}`;
            }
        })
    }
    return (
        <tr>
            <td>{props.task.username}</td>
            <td>{props.task.priority}</td>
            <td>{props.task.name}</td>
            <td>{props.task.description}</td>
            <td>{props.task.end.substring(0,10)}</td>
            <td>
                <Link to={`/${props.token}/${params.id}/update-task/${props.task._id}`}>Update</Link> | <a href="#" onClick={deleteTask}>Delete</a>
            </td>
        </tr>
    )
}

class ProjectTaskList extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            name: '',
            tasks: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/project/${this.props.params.id}`)
        .then(res => {
            if(res.data.status) {
                this.setState({
                    name: res.data.project.name,
                    tasks: res.data.project.tasks
                })
            }
            else{
                window.location = '/login';
            }
        })
        .catch(err => console.log(err));
    }

    projectTaskList() {
        return this.state.tasks.map(currentTask => {
            return <Task token={this.props.params.token} task={currentTask} key={currentTask._id}/>;
        });
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>{this.state.name}</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Priority</th>
                            <th>Task Name</th>
                            <th>Description</th>
                            <th>End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.projectTaskList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(ProjectTaskList);