import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const CreateProject = () => {
    const params = useParams();

    const [name, setName] = useState('');
    const [requirements, setRequirements] = useState('');

    const submit = (e) => {
        e.preventDefault();

        const project = {
            name: name,
            tasks: []
        }

        axios.post(`http://localhost:5000/${params.token}/project/create`, project)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else if (res.data.exists) {
                    setRequirements(`${project.name} already exists`);
                }
                else {
                    window.location = `/${params.token}/projects`;
                }
            });
    }

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Create Project</h3>
            <h4>{requirements}</h4>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" required className="form-control" value={name} onChange={(e) => { setName(e.target.value) }} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Create Project" className="btn btn-primary" />
                </div>
            </form>
        </div>

    )
};

export default CreateProject;