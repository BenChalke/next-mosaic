import styled from "styled-components";

export const UploadContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  min-height: 600px;
  background-color: #333333;
  margin-bottom: 80px;
`;

export const StyledInput = styled.input`
  display: none;
`;

export const StyledLabel = styled.label`
  border: 3px solid #2dc28e;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;