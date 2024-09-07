import SubmissionSchema from "./submissionSchema.js";
import FormSchema from "../form/formSchema.js";
import { createError, createResponse } from "#src/utils/utility.js";

const createSubmission = async (req, res) => {
  const { formId, answers } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!formId) return createError(res, "Form ID is required");
  if (!answers || !Array.isArray(answers))
    return createError(res, "Answers must be an array");

  // Validate form existence
  const form = await FormSchema.findById(formId);
  if (!form) return createError(res, "Form not found", 404);

  // Validate answers against form questions
  answers.forEach((answer, i) => {
    const question = form.questions.find(
      (q) => q._id.toString() === answer.questionId
    );
    if (!question)
      return createError(
        res,
        `Invalid question ID: ${answer.questionId} for answer: ${i + 1}`,
        400
      );
    if (!answer.answer)
      return createError(
        res,
        `Answer for question ${answer.questionId} is required`,
        400
      );
  });

  const newSubmission = new SubmissionSchema({
    form: formId,
    submittedBy: userId,
    answers,
  });

  try {
    await newSubmission.save();
    createResponse(res, newSubmission, 201);
  } catch (error) {
    createError(res, "Submission failed", 500, error);
  }
};

const getFormSubmissions = async (req, res) => {
  const { formId } = req.params;
  const userId = req.user ? req.user._id : null;

  if (!formId) return createError(res, "Form ID is required");

  const form = await FormSchema.findById(formId).select("createdBy");
  if (!form) return createError(res, "Form not found", 404);

  if (form.createdBy !== userId)
    return createError(res, "Only owner can retrieve submissions", 401);

  try {
    const submissions = await SubmissionSchema.find({ form: formId });
    createResponse(res, submissions, 200);
  } catch (error) {
    createError(res, "Error getting submissions", 500, error);
  }
};

export { createSubmission, getFormSubmissions };
