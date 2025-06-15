import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../src/pages/sentry-example-page';
import * as Sentry from '@sentry/nextjs';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

jest.mock('@sentry/nextjs', () => ({
  ...jest.requireActual('@sentry/nextjs'),
  startSpan: jest.fn((options, callback) => callback()),
  diagnoseSdkConnectivity: jest.fn(),
  captureException: jest.fn(),
}));

describe('Page', () => {
  const originalFetch = global.fetch;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (global.fetch !== originalFetch) {
      global.fetch = originalFetch;
    }
    consoleErrorSpy.mockRestore();
  });

  it('renders the main heading and description', async () => {
    Sentry.diagnoseSdkConnectivity.mockResolvedValue('ok');
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sentry-example-page/i })).toBeInTheDocument();
      expect(screen.getByText(/Click the button below, and view the sample error on the Sentry/i)).toBeInTheDocument();
    });
  });

  it('does not display "Sample error was sent to Sentry" if API call is successful', async () => {
    Sentry.diagnoseSdkConnectivity.mockResolvedValue('ok');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /Throw Sample Error/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Sample error was sent to Sentry./i)).not.toBeInTheDocument();
    });
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('displays connectivity error message when Sentry SDK is unreachable', async () => {
    Sentry.diagnoseSdkConnectivity.mockResolvedValue('sentry-unreachable');
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText(/The Sentry SDK is not able to reach Sentry right now - this may be due to an adblocker./i)).toBeInTheDocument();
    });
  });

  it('does not display connectivity error message when Sentry SDK is connected', async () => {
    Sentry.diagnoseSdkConnectivity.mockResolvedValue('ok');
    render(<Page />);
    await waitFor(() => {
      expect(screen.queryByText(/The Sentry SDK is not able to reach Sentry right now - this may be due to an adblocker./i)).not.toBeInTheDocument();
    });
  });
});