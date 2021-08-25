import { StyledInput, StyledLabel } from './styles';

interface Props {
  setResetFn: React.Dispatch<React.SetStateAction<boolean>>
}

const ImageCanvas: React.FC<Props> = ({ setResetFn }) => {
  return (
    <>
      <canvas id="imageCanvas" className="imageCanvas">
        <p>Canvas support needed!</p>
      </canvas>
      <StyledLabel htmlFor="reset-btn">Reset</StyledLabel>
      <StyledInput id="reset-btn" name="reset-btn" type="button" onClick={() => {setResetFn(true)}} />
    </>
  );
}

export default ImageCanvas;