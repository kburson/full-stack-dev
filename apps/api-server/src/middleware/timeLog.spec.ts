import timeLog from './timeLog';
import { Request, Response } from 'express';

describe('MiddleWare', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});

  it('timeLog', () => {
    const mockRequest = {
      method: 'GET',
      url: 'xyz',
    } as Request;
    const mockResponse = {} as Response;
    const next = jest.fn();

    timeLog(mockRequest, mockResponse, next);

    expect(log).toHaveBeenCalled();
  });
});
