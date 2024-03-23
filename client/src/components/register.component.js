import { useState } from 'react';
import axios from 'axios';
const CryptoJS = require('crypto-js');

const encrypt = pw => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pw));
}

function auth(username, password) {
    if (username.length > 20 || username.length < 5) {
        return false;
    }
    if (!password.length < 8) {
        let uppercase = false;
        let charsIncluded = false;
        let chars = ['!', '@', '#', '$', '%', '^', '&', '*', '?'];

        for (let i = 0; i < password.length; i++) {
            if (password[i] === password[i].toUpperCase()) {
                uppercase = true;
            }
            if (chars.includes(password[i])) {
                charsIncluded = true;
            }
        }

        if (!uppercase || !charsIncluded) {
            return false;
        }
    }
    return true;
}

const Register = (props) => {

    const [allValues, setAllValues] = useState({
        requirements: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const changeHandler = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value });
    };

    const login = (e) => {
        e.preventDefault();

        window.location = '/login';
    };

    const submit = (e) => {
        e.preventDefault();

        if (allValues.password === allValues.confirmPassword) {
            if (auth(allValues.username, allValues.password)) {
                const user = {
                    username: allValues.username,
                    password: encrypt(allValues.password)
                };

                axios.post('http://localhost:5000/register', user)
                    .then(res => {
                        if (res.data.exists) {
                            allValues.requirements = 'User already exists';
                            setAllValues({ ...allValues });
                        }
                        else {
                            if (res.data.status) {
                                window.location = `${res.data.token}/projects`;
                            }
                        }
                    });
            }
            else {
                allValues.requirements = 'Enter a valid Username/Password';
                setAllValues({ ...allValues });
            }
        }
        else {
            allValues.requirements = 'Passwords do not match';
            setAllValues({ ...allValues });
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <h4>{allValues.requirements}</h4>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" required className="form-control" name="username" value={allValues.username} onChange={changeHandler} />
                    <ul>
                        <li>5-20 Characters</li>
                    </ul>
                </div>
                <div className="form-group">
                    <label>Password </label>
                    <input type="password" required className="form-control" name="password" value={allValues.password} onChange={changeHandler} />
                    <ul>
                        <li>Minimum 8 Characters</li>
                        <li>1 Capital</li>
                        <li>1 Special Character (! @ # $ % ^ & * ?)</li>
                    </ul>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" required className="form-control" name="confirmPassword" value={allValues.confirmPassword} onChange={changeHandler} />
                </div>
                <br />
                <div className="form-group">
                    <input type="button" value="Login" className="btn btn-primary" onClick={login} />
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
};

export default Register;