import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
      //   validate: [isEmail, "Please fill a valid email address"]
      match: [/^\S+@\S+\.\S+/, "Please fill a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"]
    }
  },
  {
    timestamps: true
  }
);

//you can also add methods to your schema here
userSchema.methods.encryptPassword = async function (
  this: UserDocument,
  password: string
): Promise<string> {
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

userSchema.methods.validatePassword = async function (
  this: UserDocument,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password).catch((e) => false);
};

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  const hash = await this.encryptPassword(user.password);
  user.password = hash;

  return next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
