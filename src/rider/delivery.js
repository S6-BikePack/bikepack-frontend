import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {DeliveryStatus, ParcelStatus} from "../Enum";
import axios from "axios";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {CubeGrid} from "styled-loaders-react";

const SubTitle = styled.h2`
  margin: 20px 0 5px 30px;
`

const Box = styled.div`
  background: #fafafa;
  border: 2px solid #53B94A;
  width: calc(100% - 40px);
  height: 80%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;

  h3 {
    margin-left: 30px;
    font-weight: 400;
  }
`

const ParcelInfo = styled.p`
  margin: 10px 30px;
  ${props => props.bottom ? 'margin-bottom: 10px;' : 'margin-bottom: 0px;'};
`

const SeparatorLine = styled.div`
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 0;
  height: 2px;
  background: #878787;
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

const Delivery = (props) => {
    const [authUser] = useAuthState(auth);
    const [delivery, setDelivery] = useState(null)

    useEffect(() => {
        authUser.getIdToken(false).then(token => {
            axios.get(`http://localhost/api/deliveries/${props.delivery.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                    setDelivery(response.data)
                }
            ).catch(error => {
                console.log(error)
                props.onBack()
            })
        })

    }, []);

    return (
        delivery !== null ?
            <Box>
                <div>
                    <SubTitle>{delivery.id}</SubTitle>
                    <ParcelInfo>From: {delivery.pickup.address}</ParcelInfo>
                    <ParcelInfo>To: {delivery.destination.address}</ParcelInfo>
                    <ParcelInfo>Size: {delivery.parcel.size.width}cm, {delivery.parcel.size.height}cm, {delivery.parcel.size.depth}cm</ParcelInfo>
                    <ParcelInfo bottom>Weight: {delivery.parcel.weight}g</ParcelInfo>
                </div>
                <div>
                    {
                        delivery.Status === 0 &&
                        <MenuButton onClick={props.onSetupDelivery}>Claim delivery</MenuButton>
                    }
                    <MenuButton onClick={props.onBack} color="#878787">Back</MenuButton>
                </div>
            </Box>
            :
            <CubeGrid color="#53B94A" size="100px" duration="1s"/>
    )
};

export default Delivery;