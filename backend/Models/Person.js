import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema(
  {
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    gender: String,
    organisation: String,
    birthDate: Date,
    IFId: String,
    email: { type: String, lowercase: true },
    source: { type: String, default: "xml" }
  },
  { timestamps: true }
);

PersonSchema.index({ email: 1 });
PersonSchema.index({ givenName: 1, familyName: 1, IFId: 1 });

export default mongoose.model("Person", PersonSchema);
