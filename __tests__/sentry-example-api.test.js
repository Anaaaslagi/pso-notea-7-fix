import handler from '../src/pages/api/sentry-example-api';

describe('sentry-example-api', () => {
  it('should throw a SentryExampleAPIError', async () => {
    const req = {};
    const res = {};

    await expect(async () => { 
      await handler(req, res);
    }).rejects.toThrow('This error is raised on the backend called by the example page.');
  });

  it('should throw an error of type SentryExampleAPIError', async () => {
    const req = {};
    const res = {};

    let thrownError;
    try {
      await handler(req, res);
    } catch (error) {
      thrownError = error;
    }


    expect(thrownError).toBeDefined();
    expect(thrownError.name).toBe('SentryExampleAPIError');
  });
});