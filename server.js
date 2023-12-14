const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI,);

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String
});

const Question = mongoose.model('Question', questionSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/api/submitAnswer', async (req, res) => {
    const { questionIndex, selectedOption } = req.body;

    try {
        const question = await Question.findOne().skip(questionIndex);
        const isCorrect = question.correctAnswer === selectedOption;
        res.json({ isCorrect, question });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/addQuestion', async (req, res) => {
    const { question, options, correctAnswer } = req.body;

    try {
        const newQuestion = new Question({
            question,
            options,
            correctAnswer,
        });

        await newQuestion.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.delete('/api/question/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Question.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.delete('/api/clearQuestions', async (req, res) => {
    try {
        await Question.deleteMany();
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing questions:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
