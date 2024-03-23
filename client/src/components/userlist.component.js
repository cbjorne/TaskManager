import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const User = props => {
    return (
        <tr>
            <td>{props.user.username}</td>
            <td>
                <Link to={`/${props.token}/delete-user/${props.user._id}`}>Delete</Link>
            </td>
        </tr>
    );
};

const UserList = (props) => {
    const params = useParams();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/user`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    setUsers(res.data.users);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const userList = () => {
        return users.map(currentUser => {
            return <User token={params.token} user={currentUser} key={currentUser._id} />;
        });
    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>User List</h3>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {userList()}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;