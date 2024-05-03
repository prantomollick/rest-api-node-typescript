import { Document, Model } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";

export async function createUser(
  input: Pick<UserDocument, "name" | "email" | "password">
) {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}
