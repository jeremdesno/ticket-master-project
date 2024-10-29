export interface JwtPayload {
  username: string;
  sub: number;
  iat?: number;
  exp?: number;
}

export interface User {
  name: string;
  id: number;
}
