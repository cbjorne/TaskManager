import { useState } from 'react';
import axios from 'axios';
const CryptoJS = require('crypto-js');

const encrypt = pw => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pw));
}

const Login = (props) => {
    const [allValues, setAllValues] = useState({
        requirements: '',
        username: '',
        password: ''
    });

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value });
    };

    const register = (e) => {
        e.preventDefault();
        window.location = '/register';
    };

    const submit = (e) => {
        e.preventDefault();

        const user = {
            username: allValues.username,
            password: encrypt(allValues.password)
        };

        axios.post('http://localhost:5000/login', user)
            .then(res => {
                if (res.data.status) {
                    window.location = `${res.data.token}/projects`;
                }
                else {
                    allValues.requirements = res.data;
                    setAllValues({ ...allValues });
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Login</h2>
            <h4>{allValues.requirements}</h4>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" required className="form-control" name="username" value={allValues.name} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <label>Password </label>
                    <input type="password" required className="form-control" name="password" value={allValues.password} onChange={changeHandler} />
                </div>
                <br />
                <div className="form-group">
                    <input onClick={register} type="button" value="Register" className="btn btn-primary" />
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
};

export default Login;