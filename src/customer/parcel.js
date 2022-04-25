import React, {useEffect} from 'react';
import styled from "styled-components";
import {ParcelStatus} from "../Enum";
import axios from "axios";

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

const Parcel = (props) => {

    useEffect(() => {

       
    }, []);

    return (
        <Box>
            <div>
                <SubTitle>{props.parcel.Name}</SubTitle>
                <SeparatorLine/>
                {
                    props.parcel.Description !== "" &&
                    <>
                        <h3>{props.parcel.Description}</h3>
                        <SeparatorLine/>
                    </>
                }
                <ParcelInfo>Status: {ParcelStatus[props.parcel.Status]}</ParcelInfo>
                <ParcelInfo>Size: {props.parcel.Size.Width}cm, {props.parcel.Size.Height}cm, {props.parcel.Size.Depth}cm</ParcelInfo>
                <ParcelInfo bottom>Weight: {props.parcel.Weight}g</ParcelInfo>
            </div>
            <div>
                {
                    props.parcel.Status === 0 &&
                        <MenuButton onClick={props.onSetupDelivery}>Setup delivery</MenuButton>
                }
                <MenuButton onClick={props.onBack} color="#878787">Back</MenuButton>
            </div>
        </Box>
    );
};

export default Parcel;