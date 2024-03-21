import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './navbar.component';

const CreateTask = (props) => {
    const params = useParams();

    const [allValues, setAllValues] = useState({
        name: '',
        username: '',
        task_name: '',
        description: '',
        priority: 5,
        end: new Date(),
        users: [],
        projects: [],
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/user/`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                if (res.data.users.length > 0) {

                    //These two lines of code work
                    //allValues.users = res.data.users.map(user => user.username);
                    //setAllValues({ ...allValues });

                    //This line of code does not work
                    setAllValues({ ...allValues, users: res.data.users.map(user => user.username) });

                    //Console log statements to see what res.map should be returning vs what get set in state
                    console.log(res.data.users.map(user => user.username));
                    console.log(allValues.users);
                }
            });

        axios.get(`http://localhost:5000/${params.token}/project/`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                if (res.data.projects.length > 0) {

                    //Code above that does not work works here
                    setAllValues({ ...allValues, projects: res.data.projects.map(project => project.name) });
                }
            });
    }, []);

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const body = {
            name: allValues.name,
            username: allValues.username,
            task_name: allValues.task_name,
            description: allValues.description,
            priority: allValues.priority,
            end: allValues.end
        }

        console.log(body);

        axios.post(`http://localhost:5000/${params.token}/project/append`, body)
            .then(res => {
                if (res.data.status) {
                    window.location = `/${params.token}/project-tasks/${res.data.projectid}`;
                }
                else {
                    window.location = '/login';
                }
            })

    }

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Create Task</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Project</label>
                    <select required className="form-control" name="name" value={allValues.name} onChange={changeHandler}>
                        {
                            allValues.projects.map(project => {
                                return <option key={project} value={project}>{project}</option>
                            })
                        }
                    </select>
                    <label>Username</label>
                    <select required className="form-control" name="username" value={allValues.username} onChange={changeHandler}>
                        {
                            allValues.users.map(user => {
                                return <option key={user} value={user}>{user}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label>Task Name</label>
                    <input type="text" required className="form-control" name="task_name" value={allValues.task_name} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input type="text" required className="form-control" name="description" value={allValues.description} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <select required className="form-control" name="priority" value={allValues.priority} onChange={changeHandler}>
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
                        <DatePicker name="date" selected={allValues.end} onChange={changeHandler} />
                    </div>
                </div>
                <div className="form-group">
                    <input type="submit" value="Create Task" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
};

export default CreateTask;

/*const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent params={params}/>
    )
}

class CreateTask extends Component {
    constructor(props) {
        super(props);

        this.onChangeProject = this.onChangeProject.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeTaskName = this.onChangeTaskName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            username: '',
            task_name: '',
            description: '',
            priority: 5,
            end: new Date(),
            users: [],
            projects: [],
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/user/`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            if(res.data.users.length > 0) {
                this.setState({
                    users: res.data.users.map(user => user.username),
                    username: res.data.users[0].username
                })
            }
        })

        axios.get(`http://localhost:5000/${this.props.params.token}/project/`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            if(res.data.projects.length > 0) {
                this.setState({
                    projects: res.data.projects.map(project => project.name),
                    name: res.data.projects[0].name
                })
            }
        })
    }

    onChangeProject(e) {
        this.setState({
            name: e.target.value,
        });
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeTaskName(e) {
        this.setState({
            task_name: e.target.value
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

    onSubmit(e) {
        e.preventDefault();

        const body = {
            name: this.state.name,
            username: this.state.username,
            task_name: this.state.task_name,
            description: this.state.description,
            priority: this.state.priority,
            end: this.state.end
        }

        axios.post(`http://localhost:5000/${this.props.params.token}/project/append`, body)
        .then(res => {
            if(res.data.status) {
                window.location = `/${this.props.params.token}/project-tasks/${res.data.projectid}`;
            }
            else{
                window.location = '/login';
            }
        })
  
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>Create Task</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Project</label>
                        <select required className="form-control" value={this.state.name} onChange={this.onChangeProject}>
                            {
                                this.state.projects.map(project => {
                                    return <option key={project} value={project}>{project}</option>
                                })
                            }
                        </select>
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
                        <input type="text" required className="form-control" value={this.state.task_name} onChange={this.onChangeTaskName}/>
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
                        <input type="submit" value="Create Task" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(CreateTask);*/