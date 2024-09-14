import FormSchema from "./formSchema.js";
import SubmissionSchema from "../submission/submissionSchema.js";

import { createError, createResponse } from "#src/utils/utility.js";

const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) return "Questions should be an array";

  for (const question of questions) {
    if (!question.type) return "Question much have a type";

    if (typeof question !== "object" || !question.title)
      return "Each question must be an object with a non-empty title";

    if (question.options && !Array.isArray(question.options))
      return "Options, if provided, must be an array";
  }

  return null;
};

const createForm = async (req, res) => {
  const { name, description, questions, formImage } = req.body;

  if (!name) return createError(res, "Form name is required");
  if (!description) return createError(res, "Form description is required");

  const questionsError = validateQuestions(questions);
  if (questionsError) return createError(res, questionsError, 422);

  const newForm = new FormSchema({
    name,
    description,
    createdBy: req.user._id,
    questions,
    formImage,
  });

  newForm
    .save()
    .then((form) => {
      createResponse(res, form, 201);
    })
    .catch((err) =>
      createError(res, err.message || "Something went wrong", 500, err)
    );
};

const getUserForms = async (req, res) => {
  try {
    const forms = await FormSchema.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $addFields: {
          questionCount: { $size: "$questions" }, // Calculate question count
        },
      },
      {
        $unset: "questions", // Remove the 'questions' field
      },
    ]);

    // Fetch submission counts for each form
    const formIds = forms.map((form) => form._id);

    const submissionCounts = await SubmissionSchema.aggregate([
      { $match: { form: { $in: formIds } } },
      { $group: { _id: "$form", submissionCount: { $sum: 1 } } },
    ]);

    // Add submission count to each form
    const formsWithSubmissionCount = forms.map((form) => {
      const submissionData = submissionCounts.find(
        (sub) => sub._id.toString() === form._id.toString()
      );
      return {
        ...form,
        submissionCount: submissionData ? submissionData.submissionCount : 0, // Default to 0 if no submissions
      };
    });

    createResponse(res, formsWithSubmissionCount, 200);
  } catch (error) {
    createError(res, error?.message || "Failed to get forms", 500, error);
  }
};

const getForm = async (req, res) => {
  const { id: formId } = req.params;

  const form = await FormSchema.findById(formId).populate("createdBy", "name");

  if (!form) return createError(res, "Form not found", 404);

  createResponse(res, form, 200);
};

const updateForm = async (req, res) => {
  const { id: formId } = req.params;
  const { name, description, questions, formImage } = req.body;

  const updateObj = {};

  if (name) updateObj.name = name;
  if (description) updateObj.description = description;
  if (questions) updateObj.questions = questions;
  if (formImage) updateObj.formImage = formImage;

  const updatedForm = await FormSchema.findByIdAndUpdate(formId, updateObj, {
    new: true,
  });

  if (!updatedForm) return createError(res, "Form not found", 404);

  createResponse(res, updatedForm, 200);
};

const deleteForm = async (req, res) => {
  const { id: formId } = req.params;

  const form = await FormSchema.findByIdAndDelete(formId);

  if (!form) return createError(res, "Form not found", 404);

  createResponse(res, { message: "Form deleted successfully" }, 200);
};

export { createForm, getForm, getUserForms, updateForm, deleteForm };
