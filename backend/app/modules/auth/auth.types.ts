export interface RegisterBody {
  validate(
    body: any,
    options: { abortEarly: boolean; stripUnknown: boolean }
  ): { error: any; value: any };

  email?: string;     // optional
  phone?: string;     // optional
  password: string;
  username: string;
  fullName: string;
  purpose:string;
  avatar:string;
}


export interface LoginBody {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

