import React, { Component } from 'react';
import axios from 'axios';
const CryptoJS = require('crypto-js');

const encrypt = pw => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pw));
}

function auth(username, password){
    if(username.length > 20 || username.length < 5){
        return false;
    }
    if(!password.length < 8){
        let uppercase = false;
        let charsIncluded = false;
        let chars = ['!', '@', '#', '$', '%', '^', '&', '*', '?'];

        for(let i = 0; i < password.length; i++) {
            if(password[i] === password[i].toUpperCase()){
                uppercase = true;
            }
            if(chars.includes(password[i])){
                charsIncluded = true;
            }
        }
        if(!uppercase || !charsIncluded) {
            return false;
        }
    }
    return true;
}

export default class Register extends Component {
    constructor(props){
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onConfirmPassword = this.onConfirmPassword.bind(this);
        this.login = this.login.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            requirements: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onConfirmPassword(e) {
        this.setState({
            confirmPassword: e.target.value
        });
    }

    login(e) {
        e.preventDefault();

        window.location = '/login';
    }

    onSubmit(e) {
        e.preventDefault();

        if(this.state.password === this.state.confirmPassword){
            if(auth(this.state.username, this.state.password)) {
                const user = {
                    username: this.state.username,
                    password: encrypt(this.state.password)
                }
    
                axios.post('http://localhost:5000/register', user)
                .then(res => {
                    if(res.data.exists) {
                        this.setState({
                            username: '',
                            password: '',
                            confirmPassword: '',
                            requirements: 'User already exists'
                        });
                    }
                    else{
                        if(res.data.status) {
                            this.setState({
                                username: '',
                                password: '',
                                confrimPassword: ''
                            });
        
                            window.location = `${res.data.token}/projects`;
                        }
                    }
                });
            }
            else{
                this.setState({
                    requirements: 'Enter a valid Username/Password'
                });
            }
        }
        else{
            this.setState({
                requirements: 'Passwords do not match'
            });
        }
    }

    render() {
        return (
            <div>
                <h2>Register</h2>
                <h4>{this.state.requirements}</h4>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" required className="form-control" value={this.state.name} onChange={this.onChangeUsername}/>
                        <ul>
                            <li>5-20 Characters</li>
                        </ul>
                    </div>
                    <div className="form-group">
                        <label>Password </label>
                        <input type="password" required className="form-control" value={this.state.password} onChange={this.onChangePassword}/>
                        <ul>
                            <li>Minimum 8 Characters</li>
                            <li>1 Capital</li>
                            <li>1 Special Character (! @ # $ % ^ & * ?)</li>
                        </ul>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" required className="form-control" value={this.state.confirmPassword} onChange={this.onConfirmPassword}/>
                    </div>
                    <br/>
                    <div className="form-group">
                        <input type="button" value="Login" className="btn btn-primary" onClick={this.login}/>
                        <input type="submit" value="Submit" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}