import React, {useEffect, useState} from 'react';
import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {Page} from "./Style";
import styled from 'styled-components'
import Map from "./map";
import CustomerMenu from "./customer/customerMenu";
import axios from "axios";
import {CubeGrid} from 'styled-loaders-react'
import {useRecoilState} from "recoil";
import {customerState, riderState, userState} from "./states";
import RiderMenu from "./rider/riderMenu";

const Customer = styled(CustomerMenu)`
  margin: 10px;
  width: 25vw;
  background: white;
  display: flex;
  flex-direction: column;
`

const OverviewMap = styled(Map)`
  margin: 10px 10px 10px 0px;
  width: 75vw;
`

const Loader = styled.div`
  margin: auto;
`

const Home = (props) => {
    const [authUser, authLoading, authError] = useAuthState(auth);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true)

    const [user, setUser] = useRecoilState(userState)
    const [customer, setCustomer] = useRecoilState(customerState)
    const [rider, setRider] = useRecoilState(riderState)


    useEffect(() => {
        if (authLoading) return;

        if (!authUser) {
            setRider(undefined)
            setCustomer(undefined)
            setUser(undefined)
            return navigate("/login");
        }

        if (!user) {
            getUser()
            return
        }

        if (!customer && !rider) {
            return navigate("/select-type");
        }

        authUser.getIdToken(false).then(token => {
            console.log(token)
        })

        setLoading(false)

    }, [user, authUser, authLoading]);

    const getUser = () => {
        authUser.getIdToken(false).then(token => {

            console.log(token)
            axios.get("http://localhost/api/users/" + authUser.uid, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    setUser(response.data,);
                    setLoading(false)
                }
            ).catch(error => {
                if (error.response.status === 404) {
                    navigate("/create-user")
                }

                console.log(error)
            })
        })
    }

    const renderDashboard = () => {
        if (customer) {
            return (
                <>
                    <Customer/>
                    <OverviewMap/>
                </>
            )
        }
        else if (rider) {
            return (
                <>
                    <RiderMenu/>
                </>
            )
        }
    }

    return (
        <Page>
            {loading ? <Loader><CubeGrid color="#53B94A" size="100px" duration="1s"/></Loader> :
                renderDashboard()
            }
        </Page>
    )
};

export default Home;