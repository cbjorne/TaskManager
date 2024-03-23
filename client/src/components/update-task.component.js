import { useState, useEffect, Component } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './navbar.component';

const UpdateTask = (props) => {
    const params = useParams();

    const [allValues, setAllValues] = useState({
        username: '',
        name: '',
        description: '',
        priority: 0,
        end: new Date(),
        users: []
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/project/${params.projectid}/get/${params.taskid}`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    allValues.username = res.data.task.username;
                    allValues.name = res.data.task.name;
                    allValues.description = res.data.task.description;
                    allValues.priority = res.data.task.priority;
                    allValues.end = new Date(res.data.task.end);
                    setAllValues({ ...allValues });
                }
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:5000/${params.token}/user/`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else if (res.data.users.length > 0) {
                    allValues.users = res.data.users.map(user => user.username);
                    setAllValues({ ...allValues });
                }
            })
            .catch(err => console.log(err));
    }, []);

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value });
    };

    const deleteTask = (e) => {
        e.preventDefault();

        axios.delete(`http://localhost:5000/${params.token}/project/${params.projectid}/delete/${params.taskid}`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    window.location = `/${params.token}/projects`;
                }
            })
            .catch(err => console.log(err));
    };

    const submit = (e) => {
        e.preventDefault();

        const task = {
            username: allValues.username,
            name: allValues.name,
            description: allValues.description,
            priority: allValues.priority,
            end: allValues.end
        };

        axios.post(`http://localhost:5000/${params.token}/project/${params.projectid}/update/${params.taskid}`, task)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    window.location = `/${params.token}/project-tasks/${params.projectid}`;
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Update Task</h3>
            <form onSubmit={submit}>
                <div className="form-group">
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
                    <input type="text" required className="form-control" name="name" value={allValues.name} onChange={changeHandler} />
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
                        <DatePicker name="end" selected={allValues.end} onChange={changeHandler} />
                    </div>
                </div>
                <div className="form-group">
                    <input type="submit" value="Update Task" className="btn btn-primary" />
                    <input onClick={deleteTask} type="button" value="Delete Task" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
};

export default UpdateTask;