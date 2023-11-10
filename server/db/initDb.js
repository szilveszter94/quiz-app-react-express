import Question from "./question.model.js";
import Quiz from "./quiz.model.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoString = process.env.MONGO_STRING
const MONGO_URL = `mongodb+srv://${username}:${password}@cluster0.${mongoString}.mongodb.net/quizzy?retryWrites=true&w=majority`;

const questions = [
  {
    category: "Entertainment: Cartoon & Animations",
    type: "multiple",
    difficulty: "hard",
    question:
      "The town of \"Springfield\" in \"The Simpsons\" was originally named after?",
    correct_answer: "Springfield, Oregon",
    incorrect_answers: [
      "Springfield, Missouri",
      "Springfield, Illinois",
      "Springfield, Massachusetts",
    ],
    selected: 3,
    all_answers: [
      "Springfield, Missouri",
      "Springfield, Illinois",
      "Springfield, Massachusetts",
      "Springfield, Oregon"
    ]
  },
  {
    category: "Entertainment: Video Games",
    type: "multiple",
    difficulty: "medium",
    question:
      "Which of the following is not a playable race in the MMORPG Guild Wars 2? ",
    correct_answer: "Tengu",
    incorrect_answers: ["Sylvari", "Charr", "Asura"],
    selected: 3,
    all_answers: ["Sylvari", "Charr", "Asura", "Tengu"]
  },
  {
    category: "Entertainment: Japanese Anime & Manga",
    type: "multiple",
    difficulty: "easy",
    question:
      "In the anime Black Butler, who is betrothed to be married to Ciel Phantomhive?",
    correct_answer: "Elizabeth Midford",
    incorrect_answers: [
      "Rachel Phantomhive",
      "Alexis Leon Midford",
      "Angelina Dalles",
    ],
    selected: 3,
    all_answers: ["Rachel Phantomhive",
    "Alexis Leon Midford",
    "Angelina Dalles", "Elizabeth Midford",]
  },
  {
    category: "Entertainment: Film",
    type: "multiple",
    difficulty: "easy",
    question:
      "What was Bruce Campbell's iconic one-liner after getting a chainsaw hand in Evil Dead 2?",
    correct_answer: "Groovy.",
    incorrect_answers: ["Gnarly.", "Perfect.", "Nice."],
    selected: 3,
    all_answers: ["Gnarly.", "Perfect.", "Nice.", "Groovy."]
  },
  {
    category: "Entertainment: Video Games",
    type: "multiple",
    difficulty: "hard",
    question:
      "What is the default name of the Vampire character in \"Shining Soul 2\".",
    correct_answer: "Bloodstar",
    incorrect_answers: ["Sachs", "Dracuul", "Alucard"],
    selected: 3,
    all_answers: ["Sachs", "Dracuul", "Alucard", "Bloodstar"]
  },
  {
    category: "Entertainment: Video Games",
    type: "multiple",
    difficulty: "hard",
    question:
      "What Pokemon's Base Stat Total does not change when it evolves?",
    correct_answer: "Scyther",
    incorrect_answers: ["Pikachu", "Sneasel", "Larvesta"],
    selected: 3,
    all_answers: ["Pikachu", "Sneasel", "Larvesta", "Scyther"]
  },
  {
    category: "Entertainment: Music",
    type: "multiple",
    difficulty: "easy",
    question: "Who was \"Kung Fu Fighting\" in 1974?",
    correct_answer: "Carl Douglas",
    incorrect_answers: ["The Bee Gees", "Heatwave", "Kool & the Gang"],
    selected: 3,
    all_answers: ["The Bee Gees", "Heatwave", "Kool & the Gang", "Carl Douglas"]
  },
  {
    category: "Entertainment: Film",
    type: "multiple",
    difficulty: "medium",
    question:
      "In the 2014 film \"Birdman\", what is the primary instrument in the score?",
    correct_answer: "Drums",
    incorrect_answers: ["Saxophone", "Violin", "Actual Live Birds Singing"],
    selected: 3,
    all_answers: ["Saxophone", "Violin", "Actual Live Birds Singing", "Drums"]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the famous Papa John\'s last name?",
    correct_answer: "Schnatter",
    incorrect_answers: ["Chowder", "Williams", "ANDERSON"],
    selected: 3,
    all_answers: ["Chowder", "Williams", "ANDERSON", "Schnatter"]
  },
  {
    category: "Entertainment: Comics",
    type: "multiple",
    difficulty: "hard",
    question:
      "Which pulp hero made appearances in Hellboy and BPRD comics before getting his own spin-off?",
    correct_answer: "Lobster Johnson",
    incorrect_answers: ["Roger the Homunculus", "The Spider", "The Wendigo"],
    selected: 3,
    all_answers: ["Roger the Homunculus", "The Spider", "The Wendigo", "Lobster Johnson"]
  },
];

const loadSampleQuiz = async () => {
  await Question.deleteMany();
  await Quiz.deleteMany();
  try {
    const createdQuestions = await Question.create(questions);
    console.log("Questions created.");

    const questionIds = createdQuestions.map((question) => question._id);

    const quiz = await Quiz.create({
      uid: "testUser",
      title: "Sample quiz",
      questions: questionIds,
    });
    console.log("Quiz created.");
  } catch (error) {
    console.error("Error creating sample quiz:", error);
  }
};

// Save the quiz to the database
const main = async () => {
  await mongoose.connect(MONGO_URL);

  await loadSampleQuiz();

  mongoose.disconnect();
};

main();
