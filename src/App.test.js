import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Actually Build Backend Apps Using AI/i);
  expect(headingElement).toBeInTheDocument();
});
