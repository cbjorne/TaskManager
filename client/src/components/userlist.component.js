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

const User = props => {
    return (
        <tr>
            <td>{props.user.username}</td>
            <td>
                <Link to={`/${props.token}/delete-user/${props.user._id}`}>Delete</Link>
            </td>
        </tr>
    );
}

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state={
            users: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/user`)
        .then(res => {
            if(!res.data.status) {
                window.location = '/login';
            }
            else {
                this.setState({
                    users: res.data.users
                });
            }
        })
        .catch(err => console.log(err));
    }

    userList() {
        return this.state.users.map(currentUser => {
            return <User token={this.props.params.token} user={currentUser} key={currentUser._id}/>;
        });
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>User List</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.userList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(UserList);