import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {auth, logout} from "../firebase";
import {useRecoilState, useRecoilValue} from "recoil";
import {riderState, userState} from "../states";
import {HiLogout, HiSwitchHorizontal} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import Map, {Marker} from 'react-map-gl';
import axios from "axios";
import {useAuthState} from "react-firebase-hooks/auth";
import {useGeolocation} from "react-use";

const Content = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`

const Title = styled.h1`
  margin: 20px auto 10px 20px;
`

const SeparatorLine = styled.div`
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 0;
  height: 2px;
  background: #878787;
`

const Horizontal = styled.div`
  display: flex;
`

const IconButton = styled.button`
  height: ${props => props.size ? props.size : '200px'};
  width: ${props => props.size ? props.size : '200px'};
  margin-top: auto;
  margin-bottom: 0;
  font-size: 2rem;
  border: none;
  background: none;

  svg {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  transition: 200ms;

  :hover {
    opacity: .5;
  }
`

const MenuButton = styled.button`
  background: ${props => props.color || '#53B94A'};
  padding: 10px;
  margin: 20px;
  font-size: 1.8rem;
  width: calc(100% - 40px);
  font-family: 'Roboto Slab', sans-serif;
  color: white;
  border: none;
  transition: 100ms;

  &:hover {
    opacity: .9;
  }
`

const SubTitle = styled.h2`
  margin: 10px 0 5px 30px;
`

const InactiveBox = styled.div`
  background: #fafafa;
  margin: 20px;
  width: calc(100% - 40px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MenuText = styled.p`
  font-size: 1.4rem;
  text-align: center;
  margin-left: 50px;
  margin-right: 50px;
`

const Rider = styled.div`
  width: 25vw;
  background: white;
  display: flex;
  flex-direction: column;
`

const OverviewMap = styled(Map)`
  width: 75vw;
  height: 100vh;
`

const RiderMenu = ({className, children}) => {
    const user = useRecoilValue(userState);
    const [rider, setRider] = useRecoilState(riderState);
    const [authUser] = useAuthState(auth);
    const [availableDeliveries, setAvailableDeliveries] = useState([])
    const navigate = useNavigate()
    const location = useGeolocation();

    useEffect(() => {

        authUser.getIdToken(false).then(token => {
            axios.get(`http://localhost/api/deliveries/radius/${rider.Location.Latitude},${rider.Location.Longitude}?radius=3000`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    console.log(response.data)
                    setAvailableDeliveries(response.data)
                }
            ).catch(error => {
                console.log(error)
            })
        })
    }, [rider]);

    const becomeActive = () => {
        if(!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            console.log('Locating…');
            navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 10000});
        }
    }

    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(latitude)
    }

    const error = () => {
        console.log('Unable to retrieve your location');
    }

    const updateRiderPosition = (lat,lng) => {
        authUser.getIdToken(false).then(token => {
            axios.put(`http://localhost/api/riders/${rider.UserID}/location`, {latitude: lat, longitude: lng}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    console.log(response.data)
                    setRider(response.data)
                }
            ).catch(error => {
                console.log(error)
            })
        })
    }

    return (
        <Content>
            <Rider>
                <Horizontal>
                    <Title>{user.Name && user.Name + "'s"} delivery center</Title>
                    <IconButton size='50px' onClick={() => navigate("/select-type")}>
                        <HiSwitchHorizontal/>
                    </IconButton>
                    <IconButton size='50px' onClick={() => logout()}>
                        <HiLogout/>
                    </IconButton>
                </Horizontal>
                <SeparatorLine/>
                <InactiveBox>
                    <MenuText>You are currently inactive. Press the button below to become active again and see possible
                        deliveries.</MenuText>
                    <MenuButton onClick={becomeActive}>Start</MenuButton>
                </InactiveBox>
            </Rider>
            <OverviewMap
                initialViewState={{
                    longitude: rider.Location.Longitude,
                    latitude: rider.Location.Latitude,
                    zoom: 12.8
                }}
                mapStyle="mapbox://styles/rensb/cl1kft7vy000f15mca3yz8f0l"
                mapboxAccessToken='pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw'
            >
                <Marker draggable onDragEnd={(e) => updateRiderPosition(e.lngLat.lat, e.lngLat.lng)} longitude={rider.Location.Longitude} latitude={rider.Location.Latitude}>
                    <svg width="40" height="40">
                        <image href="rider_marker.svg" src="rider_marker.png" width="40" height="40"/>
                    </svg>
                </Marker>
                {availableDeliveries.map(x =>
                    <Marker longitude={x.PickupPoint.Longitude} latitude={x.PickupPoint.Latitude}>
                        <svg width="40" height="40">
                            <image href="box_marker.svg" src="rider_marker.png" width="40" height="40"/>
                        </svg>
                    </Marker>)}
            </OverviewMap>
        </Content>
    );
};

export default RiderMenu;