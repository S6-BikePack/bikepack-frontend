import styled from "styled-components";

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("bg.png");
  background-size: 164px;
  display: flex;
`

export const LoginBox = styled.div`
  background: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
`

export const LoginBoxIcon = styled.img`
  width: 25%;
  margin: 10px auto 20px;

  :hover {
    width: calc(25% + 10px);
    margin-top: 5px;
    margin-bottom: 15px;
  }

  transition: 200ms;
`

export const LoginBoxTitle = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin: 0 auto 10px;
`

export const LoginBoxTextField = styled.input`
  background: white;
  border: 2px solid #878787;
  padding: 10px;
  margin-left:  20px;
  margin-right:  20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  margin-bottom: 16px;
`

export const LoginBoxButton = styled.button`
  background: ${props => props.color || '#53B94A'};
  padding: 10px;
  margin-left:  20px;
  margin-right:  20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  color: white;
  border: none;
  transition: 100ms;
  &:hover {
      opacity: .9;
  }
`

export const LoginBoxError = styled.p`
  color: red;
  font-size: .8rem;
  margin-bottom: 5px;
  margin-left: 20px;
  margin-top: 0;
`

export const LoginBoxSeparator = styled.div`
  display: flex;
  margin-left: 12%;
  margin-right: 12%;
`

export const LoginBoxSeparatorLine = styled.div`
  margin-bottom: auto;
  margin-top: auto;
  flex: 1;
  height: 1px;
  background: #878787;
`

export const LoginBoxSeparatorText = styled.p`
  padding-left: 6px;
  padding-right: 6px;
  color: #878787;
`

export const LoginBoxDescription = styled.p`
  max-width: 400px;
  margin: 0 auto 20px;
  text-align: center;
`