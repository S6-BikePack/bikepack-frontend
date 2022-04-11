import styled from "styled-components";

const StyledDropdown = styled.select`
  background-image: url('data:image/svg+xml;utf8,<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.127L12 18.127L20 10.127H4Z" fill="%238E8E93"/></svg>');
  background-position: calc(100% - 0.75rem) center !important;
  -moz-appearance: none !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  background-repeat: no-repeat;
  border: 2px solid #878787;
  padding: 10px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 1.2rem;
  font-family: 'Roboto Slab', sans-serif;
  margin-bottom: 16px;
`

const Dropdown = ({ value, options, onChange }) => {
    return (
            <StyledDropdown value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option}>{option}</option>
                ))}
            </StyledDropdown>
    );
};

export default Dropdown