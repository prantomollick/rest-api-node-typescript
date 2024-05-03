import { Document, Model } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import { omit } from "lodash";

export async function createUser(
  input: Pick<UserDocument, "name" | "email" | "password">
) {
  try {
    const user = await UserModel.create(input);
    if (!user) {
      throw new Error("Failed to create a new user");
    }

    return omit(user.toJSON(), "password");
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validatePassword({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) return false;
  return omit(user.toJSON(), "password");
}
