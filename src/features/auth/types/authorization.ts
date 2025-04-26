
export interface SpecialUser {
  userId: string;
  specificProfile: string;
}

export interface EmailUser {
  email: string;
  specificProfile: string;
}

export interface AuthorizationConfig {
  SPECIAL_USERS: SpecialUser[];
  EMAIL_USERS: EmailUser[];
}
