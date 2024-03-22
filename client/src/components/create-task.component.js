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
                    allValues.users = res.data.users.map(user => user.username);
                    allValues.username = res.data.users[0].username;
                    setAllValues({ ...allValues });
                }
            });

        axios.get(`http://localhost:5000/${params.token}/project/`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                if (res.data.projects.length > 0) {
                    allValues.projects = res.data.projects.map(project => project.name);
                    allValues.name = res.data.projects[0].name;
                    setAllValues({ ...allValues });
                }
            });
    }, []);

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();

        const body = {
            name: allValues.name,
            username: allValues.username,
            task_name: allValues.task_name,
            description: allValues.description,
            priority: allValues.priority,
            end: allValues.end
        }

        axios.post(`http://localhost:5000/${params.token}/project/append`, body)
            .then(res => {
                if (res.data.status) {
                    window.location = `/${params.token}/project-tasks/${res.data.projectid}`;
                }
                else {
                    window.location = '/login';
                }
            })

    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Create Task</h3>
            <form onSubmit={submit}>
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