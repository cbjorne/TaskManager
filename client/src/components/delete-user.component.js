import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.component';

const DeleteUser = (props) => {
    const params = useParams();

    const [allValues, setAllValues] = useState({
        username: '',
        input: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/${params.token}/user/${params.id}`)
            .then(res => {
                if (!res.data.status) {
                    window.location = '/login';
                }
                else {
                    allValues.username = res.data.user.username;
                    setAllValues({ ...allValues });
                }
            })
            .catch(err => console.log(err));
    }, []);

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value })
    };

    const submit = (e) => {
        e.preventDefault();

        if (allValues.input === allValues.username) {
            axios.delete(`http://localhost:5000/${params.token}/user/delete/${params.id}`)
                .then(res => {
                    if (res.data.status) {
                        window.location = `/${params.token}/users`;
                    }
                    else {
                        window.location = '/register';
                    }
                });
        }
    };

    return (
        <div>
            <Navbar token={params.token} />
            <br />
            <h3>Delete {allValues.username}?</h3>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Confirm Username</label>
                    <input type="text" required className="form-control" name="input" value={allValues.input} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Delete User" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
};

export default DeleteUser;