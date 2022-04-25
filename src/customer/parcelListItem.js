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


const ParcelListItem = (props) => {
    return (
        <Box onClick={props.onClick}>
            <h3>{props.parcel.Name}</h3>
            <SeparatorLine/>
            <Horizontal>
                <ParcelInfo>
                    <ParcelInfoLabel>Status:</ParcelInfoLabel>
                    <ParcelInfoValue>{ParcelStatus[props.parcel.Status]}</ParcelInfoValue>
                </ParcelInfo>
                <ParcelInfo>
                    <ParcelInfoLabel>Size:</ParcelInfoLabel>
                    <ParcelInfoValue>{props.parcel.Size.Width}cm, {props.parcel.Size.Height}cm, {props.parcel.Size.Depth}cm</ParcelInfoValue>
                </ParcelInfo>
                <ParcelInfo>
                    <ParcelInfoLabel>Weight:</ParcelInfoLabel>
                    <ParcelInfoValue>{props.parcel.Weight}g</ParcelInfoValue>
                </ParcelInfo>
            </Horizontal>
        </Box>
    );
};

export default ParcelListItem;