import { ApiResponse } from "../shared";

type User = {
    id:string ;
    name:string;
    email:string;
    role:string;
    isVerified:boolean;
    accessToken:string;
}

export type signupPayload = Pick<User, "name" | "email" | "role"> & { password: string };

export type signupResponse = ApiResponse<{ user: Omit<User, "accessToken"|"isVerified">}>;

export type loginPayload = {
    email:string;
    password:string;
}

export type loginResponse = ApiResponse<User>;

export type verifyEmailPayload = {
    email:string;
    otp:string;
}

export type verifyEmailResponse = ApiResponse<{ user: Omit<User, "accessToken"> }>;

export type logoutPayload = {
    email:string;
}

export type logoutResponse = ApiResponse<{user: Omit<User, "accessToken"|"isVerified"|"role"|"name"|"id"|"email">}>;

export type forgotPasswordPayload = {
    email:string;
}

export type forgotPasswordResponse = ApiResponse<{user: Omit<User, "accessToken"|"isVerified"|"role"|"name"|"id"|"email">}>;

export type resetPasswordPayload = {
    email:string;
    otp:string;
    newPassword: string;
}

export type resetPasswordResponse = ApiResponse<{user:Omit<User,"accessToken"|"isVerified"|"role"|"name"|"id"|"email">}>;  

export type getProfilePayload = {
    userId:string;
}

export type getProfileResponse = ApiResponse<{ user: Omit<User, "accessToken"> }>;

export type updatePasswordPayload = {
    email:string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type updatePasswordResponse = ApiResponse<null>;

export type getUsersPayload = Record<string, never>;

export type getUsersResponse = ApiResponse<{
  users: Omit<User, "accessToken">;
  count: number;
}>;



