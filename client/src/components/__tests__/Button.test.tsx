import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../../ui/common/atoms/Button';

test('renders button with label', () => {
  render(<Button buttonText='Click Me' />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
