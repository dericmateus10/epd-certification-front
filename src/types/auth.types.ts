export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "MEMBER";
  };
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}