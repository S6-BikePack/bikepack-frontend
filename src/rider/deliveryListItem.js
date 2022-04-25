import React from 'react';
import styled from "styled-components";
import {ParcelStatus} from "../Enum";

const Box = styled.div`
  background: white;
  margin: 10px 10px 0;
  border: 2px solid #53B94A;

  h3 {
    margin-left: 20px;
    margin-bottom: 5px;
  }
`

const ParcelInfo = styled.div`
  margin-left: 20px;
  margin-right: 50px;
`

const ParcelInfoLabel = styled.p`
  margin-bottom: 0;
  font-size: .8rem;
  color: #787878;
`

const ParcelInfoValue = styled.p`
  margin-top: 0;
`

const Horizontal = styled.div`
  display: flex;
`

const SeparatorLine = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0;
  height: 2px;
  background: #878787;
`


const DeliveryListItem = (props) => {
    return (
        <Box onClick={props.onClick}>
            <h3>{props.delivery.id}</h3>
            <SeparatorLine/>
            <Horizontal>
                <ParcelInfo>
                    <ParcelInfoLabel>Size:</ParcelInfoLabel>
                    <ParcelInfoValue>{props.delivery.parcel.size.width}cm, {props.delivery.parcel.size.height}cm, {props.delivery.parcel.size.depth}cm</ParcelInfoValue>
                </ParcelInfo>
                <ParcelInfo>
                    <ParcelInfoLabel>Weight:</ParcelInfoLabel>
                    <ParcelInfoValue>{props.delivery.parcel.weight}g</ParcelInfoValue>
                </ParcelInfo>
            </Horizontal>
        </Box>
    );
};

export default DeliveryListItem;