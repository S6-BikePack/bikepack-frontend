import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import validator from 'validator'
import {auth, loginWithEmailPassword, registerWithEmailAndPassword} from "../firebase";
import {useNavigate} from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth";
import {
    LoginBox,
    LoginBoxButton, LoginBoxDescription, LoginBoxError, LoginBoxIcon,
    LoginBoxSeparator,
    LoginBoxSeparatorLine,
    LoginBoxSeparatorText,
    LoginBoxTextField, LoginBoxTitle,
    Page
} from "../Style";

const Error = styled.p`
  color: red;
  font-size: .8rem;
  margin-bottom: 5px;
  margin-left:  20px;
  margin-top: 0;
`

const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [password2, setPassword2] = useState('');
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) navigate("/");
    }, [user, loading]);

    const register = async () => {
        if (!validator.isEmail(email)) {
            setEmailError('Invalid email address')
        } else if (password.length < 6) {
            setPasswordError('Password too short')
        } else if (password != password2) {
            setPasswordError('Passwords do not match')
        } else {
            try {
                await registerWithEmailAndPassword(email, password)
            }
            catch (err){
                setEmailError("Could not register user")
            }
        }
    }

    return (
        <Page>
            <LoginBox>
                <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
                <LoginBoxTitle>Register</LoginBoxTitle>
                <LoginBoxDescription>Create an account to start sending and delivering parcels in your city.</LoginBoxDescription>
                <LoginBoxError>{emailError}</LoginBoxError>
                <LoginBoxTextField placeholder="E-mail" value={email} onChange={(e) => {
                    setEmailError('')
                    setEmail(e.target.value)
                }}/>
                <LoginBoxError>{passwordError}</LoginBoxError>
                <LoginBoxTextField type='password' placeholder="password" value={password} onChange={(e) => {
                    setPasswordError('')
                    setPassword(e.target.value)
                }}/>
                <LoginBoxTextField type='password' placeholder="repeat password" value={password2} onChange={(e) => {
                    setPassword2(e.target.value)
                }}/>
                <LoginBoxButton onClick={() => register()}>Register</LoginBoxButton>
                <LoginBoxSeparator>
                    <LoginBoxSeparatorLine/>
                    <LoginBoxSeparatorText>or</LoginBoxSeparatorText>
                    <LoginBoxSeparatorLine/>
                </LoginBoxSeparator>
                <LoginBoxButton color='#878787' onClick={() => navigate('/login')}>Login</LoginBoxButton>
            </LoginBox>
        </Page>
    )
}

export default Register