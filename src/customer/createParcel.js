import React, {useState} from 'react';
import styled from "styled-components";
import axios from "axios";
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
const CreateParcel = (props) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [width, setWidth] = useState("")
    const [height, setHeight] = useState("")
    const [depth, setDepth] = useState("")
    const [weight, setWeight] = useState("")

    const [authUser,] = useAuthState(auth);

    const RegisterParcel = () => {
        authUser.getIdToken(false).then(token => {
            axios.post("http://localhost/api/parcels",
                {
                    ownerId: authUser.uid,
                    name: name,
                    description: description,
                    size: {
                        width: parseInt(width),
                        height: parseInt(height),
                        depth: parseInt(depth)
                    },
                    weight: parseInt(weight)},
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
            <SubTitle>New Parcel</SubTitle>
            <SeparatorLine/>
            <MenuTextField placeholder="Parcel name" value={name} onChange={(e) => setName(e.target.value)}/>
            <MenuTextBox placeholder="Parcel description" value={description} onChange={(e) => setDescription(e.target.value)}/>
            <SeparatorLine/>
            <MenuTextField type="number" placeholder="Width (cm)" value={width} onChange={(e) => setWidth(e.target.value)}/>
            <MenuTextField type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)}/>
            <MenuTextField type="number" placeholder="Depth (cm)" value={depth} onChange={(e) => setDepth(e.target.value)}/>
            <MenuTextField type="number" placeholder="Weight (g)" value={weight} onChange={(e) => setWeight(e.target.value)}/>
            <SeparatorLine/>
            <MenuButton onClick={RegisterParcel}>Register parcel</MenuButton>
            <MenuButton color="#878787" onClick={props.onBack}>Back</MenuButton>
        </Box>
    );
};

export default CreateParcel;