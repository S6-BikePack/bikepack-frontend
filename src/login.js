import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import validator from 'validator'
import {isAuthenticated, loginWithEmailPassword} from "./_firebase";
import { useRouter } from 'next/router'

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("bg.png");
  background-size: 164px;
  display: flex;
`

const LoginBox = styled.div`
  background: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Icon = styled.img`
  width: 25%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin: 0 auto 30px;
`

const TextField = styled.input`
  background: white;
  border: 2px solid #878787;
  padding: 10px;
  margin-left: 10%;
  margin-right: 10%;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  margin-bottom: 16px;
`

const Button = styled.button`
  background: ${props => props.color || '#53B94A'};
  padding: 10px;
  margin-left: 10%;
  margin-right: 10%;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  color: white;
  border: none;
  transition: 100ms;
  &:hover {
      opacity: .9;
  }
`

const Separator = styled.div`
  display: flex;
  margin-left: 12%;
  margin-right: 12%;
`

const SeparatorLine = styled.div`
  margin-bottom: auto;
  margin-top: auto;
  flex: 1;
  height: 1px;
  background: #878787;
`

const SeparatorText = styled.p`
  padding-left: 6px;
  padding-right: 6px;
  color: #878787;
`

const Error = styled.p`
  color: red;
  font-size: .8rem;
  margin-bottom: 5px;
  margin-left: 10%;
  margin-top: 0;
`

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if(isAuthenticated){
      router.push('/home')
    }
  }, []);

  const login = () =>{
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email address')
    }
    else if(password.length < 6){
      setPasswordError('Password too short')
    }
    else{
      loginWithEmailPassword(email,password).then((response) => {
        if(isAuthenticated){
          router.push('/home')
        }
      })
    }
  }

  return (
    <Page>
    <LoginBox>
      <Icon src="icon.png"></Icon>
      <Title>Login</Title>
      <Error>{emailError}</Error>
      <TextField placeholder="E-mail" value={email} onChange={(e) => {
        setEmailError('')
        setEmail(e.target.value)
      }}/>
      <Error>{passwordError}</Error>
      <TextField type='password' placeholder="password" value={password} onChange={(e) => {
        setPasswordError('')
        setPassword(e.target.value)
      }}/>
      <Button onClick={() => login()}>Login</Button>
      <Separator>
        <SeparatorLine/>
        <SeparatorText>or</SeparatorText>
        <SeparatorLine/>
      </Separator>
      <Button color='#878787'>Register</Button>
    </LoginBox>
    </Page>
  )
}

export default Login