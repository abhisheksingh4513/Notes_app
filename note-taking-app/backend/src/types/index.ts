export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  google_id?: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface OTP {
  id: string;
  email: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
