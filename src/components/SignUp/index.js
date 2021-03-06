import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
    <div style={{ margin: 'auto', width: '80%' }} className="container">
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne, isAdmin } = this.state;
        const roles = [];

        if (isAdmin) {
            roles.push(ROLES.ADMIN);
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            // isAdmin,
            error,
        } = this.state;
        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Full Name"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control"
                    />
                </div>
                {/* <div className="form-group">
                    <label>
                        Admin:
                        <input
                            name="isAdmin"
                            type="checkbox"
                            checked={isAdmin}
                            onChange={this.onChangeCheckbox}
                        />
                    </label>
                </div> */}

                <button disabled={isInvalid} type="submit" className="btn btn-primary">Sign Up</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };