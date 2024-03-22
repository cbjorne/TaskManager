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
    }

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




/*const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent params={params}/>
    );
}

class DeleteUser extends Component {
    constructor(props) {
        super(props);

        this.onConfirmUsername = this.onConfirmUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            input: ''
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/${this.props.params.token}/user/${this.props.params.id}`)
        .then(res => {
            if(!res.data.status){
                window.location = '/login';
            }
            else{
                this.setState({
                    username: res.data.user.username
                });
            }
        })
        .catch(err => console.log(err));
    }

    onConfirmUsername(e) {
        this.setState({
            input: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()

        if(this.state.input === this.state.username) {
            axios.delete(`http://localhost:5000/${this.props.params.token}/user/delete/${this.props.params.id}`)
            .then(res => {
                if(res.data.status) {
                    window.location = `/${this.props.params.token}/users`;
                }
                else{
                    window.location = '/register';
                }
            });
        }
    }

    render() {
        return (
            <div>
                <Navbar token={this.props.params.token}/>
                <br/>
                <h3>Delete {this.state.username}?</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Confirm Username</label>
                        <input type="text" required className="form-control" value={this.state.input} onChange={this.onConfirmUsername}/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Delete User" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(DeleteUser);*/