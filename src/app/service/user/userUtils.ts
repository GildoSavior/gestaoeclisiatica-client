import { User } from "../../models/user.model";

export interface AuthUserData {
  email: string;
  accessLevel: string;
  jwtToken: string;
  isFirstLogin: boolean;
}

export class UserUtil {
  static getUserData(): AuthUserData | null {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      return null;
    }
    try {
      const data = JSON.parse(userDataString);
      // Se o nome da propriedade armazenada for "firstLogin", converta para "isFirstLogin"
      const authUser: AuthUserData = {
        email: data.email || '',
        accessLevel: data.accessLevel || '',
        jwtToken: data.jwtToken || '',
        isFirstLogin: data.firstLogin !== undefined ? data.firstLogin : false
      };
      return authUser;
    } catch (error) {
      console.error('Erro ao fazer parse dos dados do usuário:', error);
      return null;
    }
  }
}export const emptyUser: User = {
  id: '',
  name: '',
  lastName: '',
  birthDay: undefined,
  email: '',
  password: '',
  address: '',
  yearOfConversation: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  phoneNumber: undefined,
  accessLevel: undefined,
  maritalStatus: undefined,
  disciplinaryStatus: undefined,
  departmentCode: undefined,
  positionCode: undefined,
  imageUrl: '',

};


