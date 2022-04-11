import React from 'react';
import styled from "styled-components";
import {MdLogout} from "react-icons/md";
import {logout} from "../firebase";
import {useRecoilValue} from "recoil";
import {riderState, userState} from "../states";
import {HiLogout, HiSwitchHorizontal} from "react-icons/hi";
import {useNavigate} from "react-router-dom";


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

const RiderMenu = ({ className, children }) => {
    const user = useRecoilValue(userState);
    const rider = useRecoilValue(riderState);
    const navigate = useNavigate()

    return (
        <div className={className}>
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
                <MenuText>You are currently inactive. Press the button below to become active again and see possible deliveries.</MenuText>
                <MenuButton>Start</MenuButton>
            </InactiveBox>
        </div>
    );
};

export default RiderMenu;