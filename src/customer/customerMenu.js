import React, {useState} from 'react';
import styled from "styled-components";
import {MdLogout} from "react-icons/md";
import {logout} from "../firebase";
import {useRecoilValue} from "recoil";
import {userState} from "../states";
import {HiSwitchHorizontal} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import CreateParcel from "./createParcel";

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


const CustomerMenu = ({ className, children }) => {
    const user = useRecoilValue(userState);
    const [menu, setMenu] = useState(0)
    const navigate = useNavigate()
    const [hidden, setHidden] = useState(true);

    const RenderMenu = (menu) => {
        switch (menu) {
            default:
                return (
                    <>
                        <MenuButton onClick={() => setMenu(1)}>Send a parcel</MenuButton>
                        <SubTitle>History</SubTitle>
                        <SeparatorLine/>
                        <Box/>
                    </>
                )
            case 1:
                return (
                    <CreateParcel onBack={() => setMenu(0)}/>
                )
        }
    }

    return (
        <div className={className}>
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
        </div>
    );
};

export default CustomerMenu;