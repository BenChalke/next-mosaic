import { StyledInput, StyledLabel } from './styles';

interface Props {
  setResetFn: React.Dispatch<React.SetStateAction<boolean>>,
  rendered:boolean
}

const ImageCanvas: React.FC<Props> = ({ setResetFn, rendered }) => {
  return (
    <>
      <canvas id="imageCanvas" data-testid="imageCanvas" className="imageCanvas">
        <p>Canvas support needed!</p>
      </canvas>

      {rendered &&
      <>
        <StyledLabel htmlFor="reset-btn">Reset</StyledLabel>
        <StyledInput data-testid="resetInput"  id="reset-btn" name="reset-btn" type="button" onClick={() => {setResetFn(true)}} />
      </>
      }
    </>
  );
}

export default ImageCanvas;