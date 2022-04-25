import React, {useState} from 'react'
import {auth} from "../firebase";
import {useNavigate} from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth";
import {
  LoginBox,
  LoginBoxButton,
  LoginBoxDescription,
  LoginBoxError,
  LoginBoxIcon,
  LoginBoxTextField,
  LoginBoxTitle,
  Page
} from "../Style";
import axios from "axios";
import {useSetRecoilState} from "recoil";
import {userState} from "../states";

const CreateUser = () => {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [authUser, authLoading, authError] = useAuthState(auth);
  const setUser = useSetRecoilState(userState)

  const createUser = async () => {
    if(!firstName || !firstName.trim()){
      setFirstNameError('First name is required')
    }
    else if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFirstNameError('First name can only contain letters')
    } else if(!lastName || !lastName.trim()){
      setFirstNameError('First name is required')
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      setLastNameError('Last name can only contain letters')
    } else {
      try {
        authUser.getIdToken(false).then(token => {
          axios.post("http://localhost/api/users", {id: authUser.uid,name: firstName, lastName: lastName, email: authUser.email},{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
              .then(response => {
                setUser(response.data)
                navigate("/select-type")
              }
          )
        })
      }
      catch (err){
        setFirstNameError("Could not save user details")
      }
    }
  }

  return (
    <Page>
    <LoginBox>
      <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
      <LoginBoxTitle>Register</LoginBoxTitle>
      <LoginBoxDescription>Before we can start we need to know your name.</LoginBoxDescription>
      <LoginBoxError>{firstNameError}</LoginBoxError>
      <LoginBoxTextField placeholder="First name" value={firstName} onChange={(e) => {
        setFirstNameError('')
        setFirstName(e.target.value)
      }}/>
      <LoginBoxError>{lastNameError}</LoginBoxError>
      <LoginBoxTextField placeholder="Last name" value={lastName} onChange={(e) => {
        setLastNameError('')
        setLastName(e.target.value)
      }}/>
      <LoginBoxButton onClick={() => createUser()}>Submit</LoginBoxButton>
    </LoginBox>
    </Page>
  )
}

export default CreateUser