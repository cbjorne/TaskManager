import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const Task = props => {
    const params = useParams();

    const deleteTask = () => {
        axios.delete(`http://localhost:5000/${props.token}/project/${params.id}/delete/${props.task._id}`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    window.location = `/${props.token}/project-tasks/${params.id}`;
                }
            })
    };

    return (
        <tr>
            <td>{props.task.username}</td>
            <td>{props.task.priority}</td>
            <td>{props.task.name}</td>
            <td>{props.task.description}</td>
            <td>{props.task.end.substring(0, 10)}</td>
            <td>
                <Link to={`/${props.token}/${params.id}/update-task/${props.task._id}`}>Update</Link> | <a href="#" onClick={deleteTask}>Delete</a>
            </td>
        </tr>
    );
};

const ProjectTaskList = (props) => {
    const params = useParams();

    const [allValues, setAllValues] = useState({
        name: '',
        tasks: []
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/project/${params.id}`)
            .then(res => {
                if (res.data.status) {
                    allValues.name = res.data.project.name;
                    allValues.tasks = res.data.project.tasks;
                    setAllValues({ ...allValues });
                }
                else {
                    window.location = '/login';
                }
            })
            .catch(err => console.log(err));
    });

    const taskList = () => {
        return allValues.tasks.map(currentTask => {
            return <Task token={params.token} task={currentTask} key={currentTask._id} />;
        });
    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>{allValues.name}</h3>
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
                    {taskList()}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTaskList;