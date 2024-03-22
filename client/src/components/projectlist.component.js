import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const Project = props => {
    function deleteProject() {
        axios.delete(`http://localhost:5000/${props.token}/project/${props.project._id}`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
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
};

const ProjectList = (props) => {
    const params = useParams();

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/project/`)
            .then(res => {
                if (res.data.status) {
                    setProjects(res.data.projects);
                }
                else {
                    window.location = '/login';
                }
            })
            .catch(err => console.log(err));
    }, []);

    const list = () => {
        return projects.map(currentProject => {
            return <Project token={params.token} project={currentProject} key={currentProject._id} />;
        });
    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Project List</h3>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list()}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectList;