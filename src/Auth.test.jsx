import { render, screen } from '@testing-library/react';
import React from 'react';
import Auth from './components/Auth.jsx';

test('renders login title', () => {
  render(<Auth />);
  // Change text to something you know exists on your login page
  const title = screen.getByText(/Chat App/i);
  expect(title).toBeInTheDocument();
});
