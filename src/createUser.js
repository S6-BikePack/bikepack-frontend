import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import validator from 'validator'
import {auth, loginWithEmailPassword} from "./firebase";
import {useNavigate} from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth";
import {Page} from "./Style";

const LoginBox = styled.div`
  background: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
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
  margin-left:  20px;
  margin-right:  20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  margin-bottom: 16px;
`

const Button = styled.button`
  background: ${props => props.color || '#53B94A'};
  padding: 10px;
  margin-left:  20px;
  margin-right:  20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  color: white;
  border: none;
  transition: 100ms;
  &:hover {
      opacity: .9;
  }
`

const Error = styled.p`
  color: red;
  font-size: .8rem;
  margin-bottom: 5px;
  margin-left: 20px;
  margin-top: 0;
`

const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const createUser = async () => {
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFirstNameError('First name can only contain letters')
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      setLastNameError('Last name can only contain letters')
    } else {
      try {
      }
      catch (err){
        setFirstNameError("Could not save user details")
      }
    }
  }

  return (
    <Page>
    <LoginBox>
      <Icon src="icon.png"></Icon>
      <Title>Create account</Title>
      <Error>{firstNameError}</Error>
      <TextField placeholder="First name" value={firstName} onChange={(e) => {
        setFirstNameError('')
        setFirstName(e.target.value)
      }}/>
      <Error>{lastNameError}</Error>
      <TextField placeholder="Last name" value={lastName} onChange={(e) => {
        setLastNameError('')
        setLastName(e.target.value)
      }}/>
      <Button onClick={() => createUser()}>Submit</Button>
    </LoginBox>
    </Page>
  )
}

export default CreateAccount