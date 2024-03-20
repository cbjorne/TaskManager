import React, { Component } from 'react';
import axios from 'axios';
const CryptoJS = require('crypto-js');

const encrypt = pw => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pw));
}

export default class Login extends Component {
    constructor(props){
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRegister = this.onRegister.bind(this);

        this.state = {
            requirements: '',
            username: '',
            password: '',
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

    onRegister(e) {
        e.preventDefault()
        
        window.location = '/register'
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: encrypt(this.state.password)
        };

        axios.post('http://localhost:5000/login', user)
        .then(res => {
            if(res.data.status){
                this.setState({
                    requirements: '',
                    username: '',
                    password: ''
                });

                window.location = `${res.data.token}/projects`;
            }
            else{
                this.setState({
                    requirements: res.data
                });
            }
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <h2>Login</h2>
                <h4>{this.state.requirements}</h4>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" required className="form-control" value={this.state.name} onChange={this.onChangeUsername}/>
                    </div>
                    <div className="form-group">
                        <label>Password </label>
                        <input type="password" required className="form-control" value={this.state.password} onChange={this.onChangePassword}/>
                    </div>
                    <br/>
                    <div className="form-group">
                        <input onClick={this.onRegister} type="button" value="Register" className="btn btn-primary"/>
                        <input type="submit" value="Submit" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}