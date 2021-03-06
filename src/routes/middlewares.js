import { jwtSecretKey } from "../config";
import jwt from 'jsonwebtoken';
import * as error from './error';

export const logger = (req, res, next) => {
  const info = {
    from: req.ip,
    path: req.originalUrl,
    method: req.method,
    header: req.header,
    body: req.body,
  };

  const log = JSON.stringify(info, null, 2);
  console.log(log);

  next();
}


// 기본 결과 핸들러
export const resultHandler = (req, res, next) => {
  const payload = res.locals.payload;

  if (payload) {
    const data = {
      valid: true,
      status: 200,
      msg: '정상 처리',
      payload,
    };

    res.status(200);
    res.send(data);
  } else {
    next();
  }
}


//만약 알 수 없는 요청일 시 기본 핸들러
export const notFoundCommand = (req, res) => {
  res.status(404);
  res.send({
    valid: false,
    status: 404,
    msg: 'Not Found'
  });
}


//기본 에러 로거
export const defaultErrorLogger = (err, req, res, next) => {
  console.error(`######## 에러 발생 ########
${JSON.stringify(err, null, 2)}
###########################`);
  next(err);
}

// 기본 에러 핸들러
export const defaultErrorHandler = (err, req, res, next) => {
  let { status, msg, error } = err;

  status = status || 500;
  msg = msg || '알 수 없는 오류';

  res.status(status);
  res.send({
    valid: false,
    status,
    msg,
    error,
  });
}

// token 검증
export const requireAuth = (req, res, next) => {
  const authorization = req.headers['authorization'];

  jwt.verify(authorization, jwtSecretKey, (err, authData) => {
    if (err) next(error.auth(err));
    req.authData = authData;
    next();
  });
}