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
import {customerState, riderState} from "../states";
import Dropdown from "../dropdown";

const CreateRider = () => {
    const navigate = useNavigate()

    const [serviceArea, setServiceArea] = useState(0);
    const [width, setWidth] = useState(undefined)
    const [height, setHeight] = useState(undefined)
    const [depth, setDepth] = useState(undefined)

    const [capacityError, setCapacityError] = useState('')

    const [authUser,] = useAuthState(auth);
    const setCustomer = useSetRecoilState(customerState)
    const setRider = useSetRecoilState(riderState)

    const [step, setStep] = useState(0)

    const areas = [
        "Eindhoven",
        "Den Bosch",
        "Utrecht",
        "Amsterdam",
        "Rotterdam"
    ]

    const createRider = async () => {
        if(!width || !height || !depth){
            setCapacityError("Please fill out all fields before submitting")
            return
        }

        const capacity = {
            width: parseInt(width),
            height: parseInt(height),
            depth: parseInt(depth)
        }

        authUser.getIdToken(false).then(token => {
            axios.post("http://localhost/api/riders", {id: authUser.uid, serviceArea: serviceArea, capacity: capacity}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                        setCustomer(null)
                        setRider(response.data)
                        navigate("/")
                    }
                )
        })

    }

    const renderStep = (current) => {
        switch (current) {
            default:
                return (
                    <>
                        <LoginBoxDescription>Before you can start delivering parcels we first need some
                            information.</LoginBoxDescription>
                        <LoginBoxButton onClick={() => setStep(1)}>Start</LoginBoxButton>
                    </>
                )
            case 1:
                return (
                    <>
                        <LoginBoxDescription>Select the area in which you want to deliver parcels.</LoginBoxDescription>
                        <Dropdown
                            options={areas}
                            value={areas[serviceArea]}
                            onChange={(e) => setServiceArea(areas.indexOf(e.target.value))}/>
                        <LoginBoxButton onClick={() => setStep(2)}>Next</LoginBoxButton>
                    </>
                )
            case 2:
                return (
                    <>
                        <LoginBoxDescription>Enter you maximum carrying capacity.</LoginBoxDescription>
                        <LoginBoxError>{capacityError}</LoginBoxError>
                        <LoginBoxTextField type='number'  placeholder="width (cm)" value={width} onChange={(e) => {
                            setWidth(e.target.value)
                        }}/>
                        <LoginBoxTextField type='number'  placeholder="height (cm)" value={height} onChange={(e) => {
                            setHeight(e.target.value)
                        }}/>
                        <LoginBoxTextField type='number'  placeholder="depth (cm)" value={depth} onChange={(e) => {
                            setDepth(e.target.value)
                        }}/>
                        <LoginBoxButton onClick={() => createRider()}>Submit</LoginBoxButton>
                    </>
                )
        }
    }

    return (
        <Page>
            <LoginBox>
                <LoginBoxIcon src="icon.png" onClick={() => navigate("/")}/>
                <LoginBoxTitle>Welcome</LoginBoxTitle>
                {
                    renderStep(step)
                }
            </LoginBox>
        </Page>
    )
}

export default CreateRider