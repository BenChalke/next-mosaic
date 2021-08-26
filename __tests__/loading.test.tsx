/**
 * @jest-environment jsdom
 */
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from '../components/Loading/Loading';

afterEach(() => {
  cleanup();
});

test("Loading component Renders without issues", () => {
  render(<Loading />);
  const loadingEl = screen.getByTestId('loading');
  expect(loadingEl).toBeInTheDocument();
  expect(loadingEl).toHaveTextContent('Loading...');
})

