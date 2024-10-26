import request from 'supertest';
import { app, server } from '../app';

describe('Routes', () => {
  const mockedConsoleLog = jest
    .spyOn(console, 'log')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementation(() => {});
  const mockedConsoleError = jest
    .spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementation(() => {});

  const NOW = new Date('2024-11-25T08:00:00.000Z').getTime();
  const mockDateNow = jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => NOW);

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    mockedConsoleError.mockReset();
    mockedConsoleLog.mockReset();
    mockDateNow.mockReset();
  });

  describe('GET /', () => {
    it('returns a 200 response', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toEqual(
        'This is an api server for the full stack developer course on udacity.'
      );
      expect(res.text).toContain('This is an api server');
      expect(mockDateNow).toHaveBeenCalled();
    });
  });

  describe('GET /api/image', () => {
    it('should return a 204 response when requested image is not found', async () => {
      const res = await request(app).get('/api/image/xyz');
      expect(res.status).toBe(204); // no-content
    });

    it('should return a 200 response when requested image is found', async () => {
      const res = await request(app).get('/api/image/fjord.jpg');
      expect(res.status).toBe(200); // success
    });

    it('should return a png image when format=png', async () => {
      const res = await request(app).get('/api/image/fjord.jpg?format=png');

      expect(res.get('content-type')).toEqual('image/png');
    });
  });
});
