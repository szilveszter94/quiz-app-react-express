import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: [{ type: String, required: true }],
  created_at: {type: Date, default: Date.now},
  all_answers: [{ type: String }],
  selected: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (value) {
        return typeof value === "boolean" || typeof value === "number";
      },
      message: "Selected field must be a Boolean or a Number.",
    },
  },
});

export default mongoose.model("Question", questionSchema);
