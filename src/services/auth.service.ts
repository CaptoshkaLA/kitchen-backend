import { prisma } from "../../prisma/prisma-client";
import generateToken from "../utils/token";
import { LoginedUserView } from "../models/logined-user.view";
import { UserInfo } from "../models/user.info";
import { LoginUserParams } from "../models/login-user.params";

/**
 * checking user input parameters and creating and returning a new user with this parameters
 * or returning existing one
 * @param loginParams LoginUserParams model with input parameters
 * @returns LoginedUserView model with parameters of user
 */
export const login = async (
  loginParams: LoginUserParams
): Promise<LoginedUserView> => {
  const login = loginParams.login?.trim();
  const password = loginParams.password?.trim();
  let claim = null;
  if (!login) {
    throw new Error("empty login");
  }
  if (!password) {
    throw new Error("empty password");
  }
  if (
    (login === "user" && password === "user") ||
    (login === "admin" && password === "admin")
  ) {
    claim = login;
  } else throw new Error("invalid password or login");
  const existingUser = await prisma.user.findFirst({
    where: {
      email: login,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      middleName: true,
    },
  });
  if (existingUser) {
    const loginModel: UserInfo = {
      userId: existingUser.id,
      name: existingUser.name,
      surname: existingUser.name,
      middleName: existingUser.middleName,
    };
    return {
      userId: existingUser.id,
      email: login,
      name: existingUser.name,
      surname: existingUser.surname,
      middleName: existingUser.middleName,
      role: claim,
      accessToken: generateToken(loginModel),
    };
  }
  const user = await prisma.user.create({
    data: {
      email: login,
      name: `${login} name`,
      surname: `${login} surname`,
      middleName: `${login} midname`,
      role: { connect: { id: login == "user" ? 2 : 1 } },
    },
  });
  const loginModel: UserInfo = {
    userId: user.id,
    name: user.name,
    surname: user.surname,
    middleName: user.middleName,
  };
  return {
    userId: user.id,
    name: user.name,
    email: login,
    surname: user.surname,
    middleName: user.middleName,
    role: claim,
    accessToken: generateToken(loginModel),
  };
};
