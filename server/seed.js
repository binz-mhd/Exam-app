const mongoose = require('mongoose');
const Question = require('./models/question');

mongoose.connect('mongodb://localhost:27017/Achuu-Exam', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
});

const questions = [
    {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4'
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswer: 'Mars'
    },
    {
        question: 'How many leg spider have?',
        options: ['8', '2', '6', '10'],
        correctAnswer: '8'
    },
];

async function seedDatabase() {
    for (const question of questions) {
        // Check if the question already exists
        const existingQuestion = await Question.findOne(question);
        if (!existingQuestion) {
            await Question.create(question);
            console.log(`Question added: ${question.question}`);
        } else {
            console.log(`Question already exists: ${question.question}`);
        }
    }

    mongoose.connection.close();
}

seedDatabase();
