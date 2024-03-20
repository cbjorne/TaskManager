import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './navbar.component';

const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent params={params}/>
    );
};

class UpdateTask extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeTaskName = this.onChangeTaskName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        
        this.state = {
            username: '',
            name: '',
            description: '',
            priority: 0,
            end: new Date(),
            users: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/project/${this.props.params.projectid}/get/${this.props.params.taskid}`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else{
                this.setState({
                    username: res.data.task.username,
                    name: res.data.task.name,
                    description: res.data.task.description,
                    priority: res.data.task.priority,
                    end: new Date(res.data.task.end)
                });
            }
        })
        .catch(err => console.log(err));

        axios.get(`http://localhost:5000/${this.props.params.token}/user/`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else if(res.data.users.length > 0) {
                this.setState({
                    users: res.data.users.map(user => user.username),
                });
            }
        })
    }
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeTaskName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangePriority(e) {
        this.setState({
            priority: e.target.value
        });
    }

    onChangeEnd(e) {
        this.setState({
            end: e
        });
    }

    onDeleteTask(e) {
        e.preventDefault();
        console.log(this.props.params.id);
        axios.delete(`http://localhost:5000/${this.props.params.token}/project/${this.props.params.projectid}/delete/${this.props.params.taskid}`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else {
                window.location = `/${this.props.params.token}/projects`;
            }
        });

    }

    onSubmit(e) {
        e.preventDefault();

        const task = {
            username: this.state.username,
            name: this.state.name,
            description: this.state.description,
            priority: this.state.priority,
            end: this.state.end
        }

        axios.post(`http://localhost:5000/${this.props.params.token}/project/${this.props.params.projectid}/update/${this.props.params.taskid}`, task)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else {
                window.location = `/${this.props.params.token}/project-tasks/${this.props.params.projectid}`;
            }
        });
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>Update Task</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <select required className="form-control" value={this.state.username} onChange={this.onChangeUsername}>
                            {
                                this.state.users.map(user => {
                                    return <option key={user} value={user}>{user}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Task Name</label>
                        <input type="text" required className="form-control" value={this.state.name} onChange={this.onChangeTaskName}/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" required className="form-control" value={this.state.description} onChange={this.onChangeDescription}/>
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select required className="form-control" value={this.state.priority} onChange={this.onChangePriority}>
                            <option key={1} value={1}>1</option>
                            <option key={2} value={2}>2</option>
                            <option key={3} value={3}>3</option>
                            <option key={4} value={4}>4</option>
                            <option key={5} value={5}>5</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Window End</label>
                        <div>
                            <DatePicker selected={this.state.end} onChange={this.onChangeEnd}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update Task" className="btn btn-primary"/>
                        <input onClick={this.onDeleteTask} type="button" value="Delete Task" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(UpdateTask);