import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/index.ts";

const credentialSchema = new Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>(
  "Credential",
  credentialSchema
);

function create(username: string, password: string): Promise<Credential> {
  return credentialModel
    .findOne({ username })
    .then((found) => {
      if (found) throw new Error(`Username exists: ${username}`);
    })
    .then(() =>
      bcrypt
        .genSalt(10)
        .then((salt: string) => bcrypt.hash(password, salt))
        .then((hashedPassword: string) => {
          const creds = new credentialModel({
            username,
            hashedPassword
          });
          return creds.save();
        })
    );
}

function verify(username: string, password: string): Promise<string> {
  return credentialModel
    .findOne({ username })
    .then((found) => {
      if (!found) {
        throw new Error("Invalid username or password");
      }
      return bcrypt
        .compare(password, found.hashedPassword)
        .then((result: boolean) => {
          if (!result) throw new Error("Invalid username or password");
          return found.username;
        });
    });
}

export default { create, verify };