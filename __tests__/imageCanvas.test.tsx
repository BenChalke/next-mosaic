/**
 * @jest-environment jsdom
 */
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCanvas from '../components/ImageCanvas/ImageCanvas';

afterEach(() => {
  cleanup();
});

test("ImageCanvas Renders", () => {
  const setReset = () => {};
  const rendered = false;

  render(<ImageCanvas setResetFn={setReset} rendered={rendered} />);
  const imageCanvasEl = screen.getByTestId('imageCanvas');
  expect(imageCanvasEl).toBeInTheDocument();
})

test("ImageCanvas Renders with reset button", () => {
  const setReset = () => {};
  const rendered = true;

  render(<ImageCanvas setResetFn={setReset} rendered={rendered} />);
  const imageCanvasEl = screen.getByTestId('imageCanvas');
  expect(imageCanvasEl).toContainHTML('<input');
  const resetInputEl = screen.getByTestId('resetInput'); 
  expect(resetInputEl).toBeInTheDocument();
})

test("ImageCanvas Renders without reset button", () => {
  const setReset = () => {};
  const rendered = false;

  render(<ImageCanvas setResetFn={setReset} rendered={rendered} />);
  const resetInputEl = screen.queryByText('Reset'); 
  expect(resetInputEl).not.toBeInTheDocument();
})
