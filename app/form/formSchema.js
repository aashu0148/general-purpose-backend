import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      ref: "User",
      type: String,
      required: true,
    },
    formImage: String,
    questions: Array,
  },
  {
    timestamps: true,
  }
);

const FormSchema = mongoose.model("Form", schema);

export default FormSchema;
