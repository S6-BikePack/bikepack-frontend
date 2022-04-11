import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import validator from 'validator'
import {auth, loginWithEmailPassword} from "../firebase";
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

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);

  const login = async () => {
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email address')
    } else if (password.length < 6) {
      setPasswordError('Password too short')
    } else {
      try {
        await loginWithEmailPassword(email, password)
      }
      catch (err){
        setEmailError("Email or password are incorrect")
      }
    }
  }

  return (
    <Page>
    <LoginBox>
      <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
      <LoginBoxTitle>Login</LoginBoxTitle>
      <LoginBoxDescription>Welcome to BikePack, the local delivery platform.</LoginBoxDescription>
      <LoginBoxError>{emailError}</LoginBoxError>
      <LoginBoxTextField type='email' placeholder="e-mail" value={email} onChange={(e) => {
        setEmailError('')
        setEmail(e.target.value)
      }}/>
      <LoginBoxError>{passwordError}</LoginBoxError>
      <LoginBoxTextField type='password' placeholder="password" value={password} onChange={(e) => {
        setPasswordError('')
        setPassword(e.target.value)
      }}/>
      <LoginBoxButton onClick={() => login()}>Login</LoginBoxButton>
      <LoginBoxSeparator>
        <LoginBoxSeparatorLine/>
        <LoginBoxSeparatorText>or</LoginBoxSeparatorText>
        <LoginBoxSeparatorLine/>
      </LoginBoxSeparator>
      <LoginBoxButton color='#878787' onClick={() => navigate('/register')}>Register</LoginBoxButton>
    </LoginBox>
    </Page>
  )
}

export default Login