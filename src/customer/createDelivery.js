import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverHeader,
} from 'styled-popover-component';
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";


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
  margin: 10px 20px;
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
  margin: 20px 0 5px 30px;
`

const Box = styled.div`
  background: #e8e8e8;
  margin: 20px 20px 0;
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
  margin: 10px 20px;
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

const GeoPopover = styled(Popover)`
  margin-top: -5px;
  background-color: #f3f3f3;
  border: 2px solid #53B94A;
  border-radius: 0;
  padding: 0;
`

const GeoPopoverButton = styled.button`
  margin: 0;
  min-height: 40px;
  background-color: #fafafa;
  border: none;
  width: 100%;
  border-bottom: 1px solid #878787;
  border-radius: 0;
  font-family: 'Roboto Slab', sans-serif;
  text-align: left;

  :hover {
    background-color: #dcdcdc;
  }
`

const TimePicker = styled(DatePicker)`
  background: white;
  border: 2px solid #878787;
  padding: 10px;
  margin: 10px 20px;
  font-size: 1rem;
  font-family: 'Roboto Slab', sans-serif;
  resize: none;
  width: calc(100% - 65px);
`

const CreateDelivery = (props) => {
    const [authUser,] = useAuthState(auth);

    const [delivery, setDelivery] = useState(null)

    const [pickupPoint, setPickupPoint] = useState(null)
    const [pickupPointSearch, setPickupPointSearch] = useState(null)
    const [pickupPointOptions, setPickupPointOptions] = useState([])

    const [pickupTime, setPickupTime] = useState(null)

    const [deliveryPoint, setDeliveryPoint] = useState(null)
    const [deliveryPointSearch, setDeliveryPointSearch] = useState(null)
    const [deliveryPointOptions, setDeliveryPointOptions] = useState([])

    const [position, setPosition] = useState([0, 0]);

    const GetPickupLocation = (search) => {
        setPickupPoint(null)
        setPickupPointSearch(search)
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + search + ".json?country=nl&proximity=ip&types=address&access_token=pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw")
            .then(response => {
                    setPickupPointOptions(response.data.features)
                }
            )
    }

    const SetPickupLocation = (location) => {
        setPickupPoint(location);
        setPickupPointSearch(location.place_name);
        props.setMarker(location.center[1], location.center[0], "./pickup_marker.svg", "pickup")
    }

    const GetDeliveryLocation = (search) => {
        setDeliveryPoint(null)
        setDeliveryPointSearch(search)
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + search + ".json?country=nl&proximity=ip&types=address&access_token=pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw")
            .then(response => {
                    setDeliveryPointOptions(response.data.features)
                }
            )
    }

    const SetDeliveryLocation = (location) => {
        setDeliveryPoint(location);
        setDeliveryPointSearch(location.place_name);
        props.setMarker(location.center[1], location.center[0], "./delivery_marker.svg", "delivery")
    }

    const RegisterDelivery = () => {
        if(pickupPoint == null || deliveryPoint == null || pickupTime == null)
            return;

        authUser.getIdToken(false).then(token => {
            axios.post("http://localhost/api/deliveries",
                {
                    parcelId: props.parcel.ID,
                    ownerId: props.parcel.OwnerId,
                    pickupPoint: {
                        latitude: pickupPoint.center[1],
                        longitude: pickupPoint.center[0]
                    },
                    deliveryPoint: {
                        latitude: deliveryPoint.center[1],
                        longitude: deliveryPoint.center[0]
                    },
                    pickupTime: (pickupTime.getTime() / 1000),
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                        props.onBack()
                    }
                )
        })
    }

    return (
        <Box>
            <SubTitle>Create delivery - {props.parcel.Name}</SubTitle>
            <SeparatorLine/>
            <MenuTextField placeholder="Pickup point" value={pickupPointSearch} onChange={(e) => {
                GetPickupLocation(e.target.value);
                setPosition([
                    e.target.offsetTop + e.target.offsetHeight,
                    e.target.offsetLeft,
                    e.target.offsetWidth - 4
                ])
            }}/>
            <GeoPopover
                hidden={pickupPointOptions.length === 0 || pickupPoint !== null}
                style={{
                    top: `${position[0]}px`,
                    left: `${position[1]}px`,
                    maxWidth: `${position[2]}px`,
                    width: `${position[2]}px`,
                }}
                bottom
            >
                {
                    pickupPointOptions.map(x => <GeoPopoverButton
                        onClick={() => SetPickupLocation(x)}>{x.place_name}</GeoPopoverButton>)
                }
            </GeoPopover>
            <TimePicker dateFormat="MMMM d, yyyy h:mm aa" showTimeSelect selected={pickupTime} onChange={(date) => setPickupTime(date)} />
            <SeparatorLine/>
            <MenuTextField placeholder="Delivery point" value={deliveryPointSearch} onChange={(e) => {
                GetDeliveryLocation(e.target.value);
                setPosition([
                    e.target.offsetTop + e.target.offsetHeight,
                    e.target.offsetLeft,
                    e.target.offsetWidth - 4
                ])
            }}/>
            <GeoPopover
                hidden={deliveryPointOptions.length === 0 || deliveryPoint !== null}
                style={{
                    top: `${position[0]}px`,
                    left: `${position[1]}px`,
                    maxWidth: `${position[2]}px`,
                    width: `${position[2]}px`,
                }}
                bottom
            >
                {
                    deliveryPointOptions.map(x => <GeoPopoverButton
                        onClick={() => SetDeliveryLocation(x)}>{x.place_name}</GeoPopoverButton>)
                }
            </GeoPopover>
            <SeparatorLine/>
            <MenuButton onClick={RegisterDelivery}>Register delivery</MenuButton>
            <MenuButton color="#878787" onClick={props.onBack}>Back</MenuButton>
        </Box>
    );
};

export default CreateDelivery;