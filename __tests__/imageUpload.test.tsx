/**
 * @jest-environment jsdom
 */
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUpload from '../components/ImageUpload/ImageUpload';

afterEach(() => {
  cleanup();
});

const stdTileWidth = '16';
const stdTileHeight = '16';

test("imageUploadEl Renders", () => {
  render(<ImageUpload stdTileWidth={stdTileWidth}  stdTileHeight={stdTileHeight}/>);
  const imageUploadEl = screen.getByTestId('uploadContainer');
  expect(imageUploadEl).toBeInTheDocument();
})

test("imageUploadEl has an upload button", () => {
  render(<ImageUpload stdTileWidth={stdTileWidth}  stdTileHeight={stdTileHeight}/>);
  const imageUploadEl = screen.getByTestId('uploadContainer');
  expect(imageUploadEl).toContainHTML('<input');
  expect(imageUploadEl).toContainHTML('<label');
})
