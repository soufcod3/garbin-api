import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";

export interface IContext {
  token: string | null;
  user?: User;
}

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    console.log("data", data);
    return await datasource.getRepository(User).save(data);
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("username") username: string,
    @Ctx() context: IContext
  ): Promise<User> {
    const user = await datasource
      .getRepository(User)
      .findOne({ where: { id: context.user.id } });
    if (username != null) {
      user.username = username;
    }

    return await datasource.getRepository(User).save({ ...user, username });
  }

  @Mutation(() => User)
  async createUserByRole(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    if (data.role === "") {
      delete data.role;
    }
    return await datasource.getRepository(User).save(data);
  }

  @Mutation(() => User)
  async createAdmin(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource
      .getRepository(User)
      .save({ ...data, role: "ADMIN" });
  }

  @Mutation(() => User)
  async createSuperAdmin(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource
      .getRepository(User)
      .save({ ...data, role: "SUPERADMIN" });
  }

  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<string | null> {
    try {
      // 1st step : search user by email
      const user = await datasource
        .getRepository(User)
        .findOne({ where: { email: data.email } });
      if (!user) {
        return null;
      }

      // 2nd step : compare the user hashed password with the clear password
      if (await verify(user.password, data.password)) {
        // Jwt generation
        const token = sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
        return token;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  @Authorized()
  @Query(() => User, { nullable: true })

  @Authorized()
  @Query(() => User, { nullable: true })
  async loggedUser(@Ctx() context: IContext): Promise<User | null> {

    const userRepository = datasource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: context.user.id },
    //   relations: { blogs: { picture: true } }
    });

    return user;

  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await datasource
      .getRepository(User)
      .find();
  }

  @Query(() => User)
  async hasSuperAdmin(): Promise<User> {
    return await datasource
      .getRepository(User)
      .findOne({ where: { role: "SUPERADMIN" } });
  }


}