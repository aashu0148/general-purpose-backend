import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  inputType: String,
  options: [String], // Assuming the question might have options (e.g., for multiple-choice)
});

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
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const FormSchema = mongoose.model("Form", schema);

export default FormSchema;
