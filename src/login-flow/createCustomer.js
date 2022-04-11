import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import validator from 'validator'
import {auth, loginWithEmailPassword} from "../firebase";
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
import * as PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import {customerState, userState} from "../states";
import Dropdown from "../dropdown";

const CreateCustomer = () => {
    const navigate = useNavigate()

    const [serviceArea, setServiceArea] = useState(0);
    const [authUser,] = useAuthState(auth);
    const setCustomer = useSetRecoilState(customerState)

    const areas = [
        "Eindhoven",
        "Den Bosch",
        "Utrecht",
        "Amsterdam",
        "Rotterdam"
    ]

    const createCustomer = async () => {
        authUser.getIdToken(false).then(token => {
            axios.post("http://localhost/api/customers", {id: authUser.uid, serviceArea: serviceArea}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                        setCustomer(response.data)
                        navigate("/")
                    }
                )
        })

    }

    return (
        <Page>
            <LoginBox>
                <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
                <LoginBoxTitle>Welcome</LoginBoxTitle>
                <LoginBoxDescription>Select the area in which you want to send parcels.</LoginBoxDescription>
                <Dropdown
                    options={areas}
                    value={areas[serviceArea]}
                    onChange={(e) => setServiceArea(areas.indexOf(e.target.value))}/>
                <LoginBoxButton onClick={() => createCustomer()}>Submit</LoginBoxButton>
            </LoginBox>
        </Page>
    )
}

export default CreateCustomer