export interface LoginedUserView {
  userId: number;
  email: string;
  name: string;
  surname: string;
  middleName: string | null;
  role: string;
  accessToken: string;
}
