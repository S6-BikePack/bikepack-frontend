import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {MdLogout} from "react-icons/md";
import {auth, logout} from "../firebase";
import {useRecoilValue} from "recoil";
import {userState} from "../states";
import {HiSwitchHorizontal} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import CreateParcel from "./createParcel";
import Map, {Marker} from "react-map-gl";
import axios from "axios";
import {useAuthState} from "react-firebase-hooks/auth";
import ParcelListItem from "./parcelListItem";
import Parcel from "./parcel";
import CreateDelivery from "./createDelivery";

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
  max-height: 2px;
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
  svg{
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }
  transition: 200ms;
  :hover{
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

const Box = styled.div`
  background: #e8e8e8;
  margin: 20px;
  width: calc(100% - 40px);
  height: 80%;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const MenuTextField = styled.input`
  background: white;
  border: 2px solid #878787;
  padding: 10px;
  margin: 10px 20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
`

export const MenuTextBox = styled.textarea`
  background: white;
  border: 2px solid #878787;
  padding: 10px;
  margin:  10px 20px;
  font-size: 1rem;
  font-family: 'Roboto Slab', sans-serif;
  resize: none;
`

const MenuBoxButton = styled(MenuButton)`
  margin-top: 10px;
  margin-bottom: 10px;
  background: none;
  border: 2px solid ${props => props.color || '#53B94A'};
  color: ${props => props.color || '#53B94A'};
  font-size: 1.2rem;
  &:hover {
    background: ${props => props.color || '#53B94A'};
    color: white;
  }
`

const Customer = styled.div`
  width: 25vw;
  background: white;
  display: flex;
  flex-direction: column;
`

const OverviewMap = styled(Map)`
  width: 75vw;
  height: 100vh;
`


const CustomerMenu = ({ className, children }) => {
    const [, forceRender] = useState({});

    const user = useRecoilValue(userState);
    const [menu, setMenu] = useState(0)
    const navigate = useNavigate()
    const [authUser] = useAuthState(auth);
    const [hidden, setHidden] = useState(true);

    const [parcels, setParcels] = useState([])
    const [parcel, setParcel] = useState(null)

    const [markers, setMarkers] = useState([])

    useEffect(() => {
      if(menu == 0){
        FetchParcels()
      }
    }, [menu]);

    const FetchParcels = () => {
        authUser.getIdToken(false).then(token => {
            console.log(user)
            axios.get(`http://localhost/api/customers/${user.ID}/parcels`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    service_area: "ehv"
                }
            }).then(response => {
                    console.log(response.data)
                    setParcels(response.data)
                }
            ).catch(error => {
                console.log(error)
            })
        })
    }

    const OpenParcel = (parcel) => {
        setParcel(parcel);
        setMenu(2);
    }

    const RenderMenu = (menu) => {
        switch (menu) {
            default:
                return (
                    <>
                        <MenuButton onClick={() => setMenu(1)}>Send a parcel</MenuButton>
                        <SubTitle>History</SubTitle>
                        <SeparatorLine/>
                        <Box>
                            {parcels.sort((a,b) => b.Status - a.Status).map(x => <ParcelListItem onClick={() => OpenParcel(x)} parcel={x}/>)}
                        </Box>
                    </>
                )
            case 1:
                return (
                    <CreateParcel onBack={() => setMenu(0)}/>
                )
            case 2:
                return (
                    <Parcel onBack={() => setMenu(0)} onSetupDelivery={() => setMenu(3)} parcel={parcel}/>
                )
            case 3:
                return (
                    <CreateDelivery onBack={() => {
                        setMarkers([])
                        FetchParcels()
                        setMenu(0)
                    }} parcel={parcel} setMarker={SetMarker}/>
                )
        }
    }

    const SetMarker = (lat,lng,img,name) => {
        const exists = markers.find(x => x.name === name);
        console.log(exists)
        if(exists){
            const m = markers;
            m[markers.indexOf(exists)] = {latitude: lat, longitude: lng, image: img, name: name}
            setMarkers(m)
            forceRender({})
        }
        else{
            setMarkers([...markers, {latitude: lat, longitude: lng, image: img, name: name}])
        }
    }

    return (
        <Content>
            <Customer>
            <Horizontal>
                <Title>{user.Name && user.Name + "'s"} parcel center</Title>
                <IconButton size='50px' onClick={() => navigate("/select-type")}>
                    <HiSwitchHorizontal/>
                </IconButton>
                <IconButton size='50px' onClick={() => logout()}>
                    <MdLogout/>
                </IconButton>
            </Horizontal>
            <SeparatorLine/>
            {RenderMenu(menu)}
            </Customer>
            <OverviewMap
                initialViewState={{
                    longitude:  5.470339729168276,
                    latitude: 51.44080049575415,
                    zoom: 12.8
                }}
                mapStyle="mapbox://styles/rensb/cl1kft7vy000f15mca3yz8f0l"
                mapboxAccessToken='pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw'
            >
                {markers.map(x =>
                    <Marker longitude={x.longitude} latitude={x.latitude}>
                        <svg width="40" height="40">
                            <image href={x.image} width="40" height="40"/>
                        </svg>
                    </Marker>)}
            </OverviewMap>
        </Content>
    );
};

export default CustomerMenu;