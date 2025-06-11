import '@testing-library/jest-dom';
jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));