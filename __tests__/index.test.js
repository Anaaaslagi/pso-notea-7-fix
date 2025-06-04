import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index.js';

test('menampilkan judul catatan', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /catatan/i })).toBeInTheDocument();
});
