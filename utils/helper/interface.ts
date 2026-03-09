export interface UserCredentials {
  username: string;
  password: string;
}

export interface EnvironmentConfig {
  baseURL: string;
  credentials: UserCredentials;
}

export interface TestData {
  users: Users;
}

export interface Users {
  student: studentUser;
}

export interface studentUser {
  [key: string]: User; // Map-like structure (e.g., user1, user2)
}

export interface User {
  username: string;
  password: string;
  section: string;
  clinic: string;
  uid: string;
}
