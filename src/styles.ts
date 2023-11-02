import styled, { createGlobalStyle } from "styled-components";
import { Button } from "@oykos-development/devkit-react-ts-styled-components";

const primaryColor = "#007bff";
const whiteColor = "#FFFFFF";
const hoverColor = "#0056b3";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f3f4f6;
    margin: 0;
    padding: 0;
  }
`;

export const MapContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

export const InputWrapper = styled.div`
  width: 470px;
  position: relative;
  margin-bottom: 10px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #007bff;
  }
`;

export const StyledButton = styled(Button)`
  background-color: ${primaryColor};
  color: ${whiteColor};
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${hoverColor};
  }
`;

export const PredictionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  max-height: 150px;
  overflow-y: auto;
`;

export const PredictionItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e1e1e1;
  }
`;
