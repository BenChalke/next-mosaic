/**
 * @jest-environment jsdom
 */
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from '../pages';

afterEach(() => {
  cleanup();
});

test("Home Page Renders", () => {
  render(<Homepage />);
  const homepageEl = screen.getByTestId('homepage');
  expect(homepageEl).toBeInTheDocument();
})

test("Home Page has title", () => {
  render(<Homepage />);
  const homepageEl = screen.getByTestId('homepage');
  expect(homepageEl).toHaveTextContent('Next.js Mosaic');
})
