import React from 'react'
import styled from 'styled-components'
import {auth} from "../firebase";
import {useNavigate} from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth";
import {
    LoginBox,
    LoginBoxButton,
    LoginBoxDescription,
    LoginBoxIcon, LoginBoxTitle,
    Page
} from "../Style";
import axios from "axios";
import {MdDirectionsBike} from "react-icons/md";
import {BsBoxSeam} from "react-icons/bs"
import {useRecoilState, useSetRecoilState} from "recoil";
import {customerState, riderState} from "../states";

const Horizontal = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
`

const BigButton = styled(LoginBoxButton)`
  flex: 1;
  margin: 10px;
  svg {
    height: ${props => props.size ? props.size : '100px'};
    width: ${props => props.size ? props.size : '100px'};
  }
  p {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
`

const SelectType = () => {
    const navigate = useNavigate()

    const [authUser, authLoading, authError] = useAuthState(auth);
    const setCustomer = useSetRecoilState(customerState);
    const setRider = useSetRecoilState(riderState);

    const selectRider = () => {
        authUser.getIdToken(false).then(token => {
            axios.get("http://localhost/api/riders/" + authUser.uid, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    setCustomer(undefined)
                    setRider(response.data);
                    navigate("/")
                }
            ).catch(error => {
                if (error.response.status === 404) {
                    navigate("/create-rider")
                }
            })
        })
    }

    const selectCustomer = () => {
        authUser.getIdToken(false).then(token => {
            axios.get("http://localhost/api/customers/" + authUser.uid, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    setRider(undefined)
                    setCustomer(response.data);
                    navigate("/")
                }
            ).catch(error => {
                if (error.response.status === 404) {
                    navigate("/create-customer")
                }
            })
        })
    }

    return (
        <Page>
            <LoginBox>
                <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
                <LoginBoxTitle>I want to...</LoginBoxTitle>
                <LoginBoxDescription>Select if you want start sending parcels or become a delivery rider. (you can change this later)</LoginBoxDescription>
                <Horizontal>
                    <BigButton onClick={() => selectCustomer()}>
                        <BsBoxSeam/>
                        <p>Send parcels</p>
                    </BigButton>
                    <BigButton onClick={() => selectRider()}>
                        <MdDirectionsBike/>
                        <p>Deliver parcels</p>
                    </BigButton>
                </Horizontal>
            </LoginBox>
        </Page>
    )
}

export default SelectType