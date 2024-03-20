import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent params={params}/>
    )
}

class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            requirements: '',
            tasks: []
        }
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const project = {
            name: this.state.name,
            tasks: []
        }

        axios.post(`http://localhost:5000/${this.props.params.token}/project/create`, project)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else if(res.data.exists) {
                this.setState({
                    requirements: `${project.name} already exists`
                });
            }
            else {
                window.location = `/${this.props.params.token}/projects`;
            }
        });
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>Create Project</h3>
                <h4>{this.state.requirements}</h4>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Project Name</label>
                        <input type="text" required className="form-control" value={this.state.name} onChange={this.onChangeName}/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Project" className="btn btn-primary"/>
                    </div>
                </form>
            </div>

        )
    }
}

export default withRouter(CreateProject);