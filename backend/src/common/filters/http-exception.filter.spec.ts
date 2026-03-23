import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function buildHost(jsonMock: jest.Mock) {
  const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  return {
    switchToHttp: () => ({
      getResponse: () => ({ status: statusMock }),
    }),
    statusMock,
  };
}

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('formats a plain string exception response', () => {
    const jsonMock = jest.fn();
    const { switchToHttp, statusMock } = buildHost(jsonMock) as any;
    const host = { switchToHttp } as unknown as ArgumentsHost;
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Not found' }),
    );
  });

  it('formats an object exception response with message and error', () => {
    const jsonMock = jest.fn();
    const { switchToHttp, statusMock } = buildHost(jsonMock) as any;
    const host = { switchToHttp } as unknown as ArgumentsHost;
    const exception = new HttpException(
      { message: 'Validation failed', error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
    });
  });

  it('includes statusCode, message, and error fields in response', () => {
    const jsonMock = jest.fn();
    const { switchToHttp } = buildHost(jsonMock) as any;
    const host = { switchToHttp } as unknown as ArgumentsHost;
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, host);

    const payload = jsonMock.mock.calls[0][0];
    expect(payload).toHaveProperty('statusCode');
    expect(payload).toHaveProperty('message');
    expect(payload).toHaveProperty('error');
  });
});
