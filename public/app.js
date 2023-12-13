// public/app.js

let trueScore = 0;
let falseScore = 0;

async function submitAnswer(questionIndex) {
    const selectedOption = document.querySelector(`input[name="option-${questionIndex}"]:checked`);
    const submitButton = document.getElementById(`submit-button-${questionIndex}`);

    if (!selectedOption) {
        alert('Please select an option.');
        return;
    }

    // Disable the submit button to prevent multiple taps
    submitButton.disabled = true;

    try {
        const response = await fetch('/api/submitAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questionIndex, selectedOption: selectedOption.value }),
        });

        if (response.ok) {
            const { isCorrect, question } = await response.json();
            handleAnswerSubmit(isCorrect, document.getElementById('questions-container').children[questionIndex]);
            updateScore(isCorrect);
        } else {
            console.error('Error submitting answer:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
    }
}

function handleAnswerSubmit(isCorrect, questionElement) {
    if (isCorrect) {
        questionElement.style.color = 'green';
    } else {
        questionElement.style.color = 'red';
    }
}

function updateScore(isCorrect) {
    if (isCorrect) {
        trueScore++;
        document.getElementById('true-score').textContent = trueScore;
    } else {
        falseScore++;
        document.getElementById('false-score').textContent = falseScore;
    }
}

async function fetchQuestions() {
    try {
        const response = await fetch('/api/questions');
        if (response.ok) {
            const questions = await response.json();
            displayQuestions(questions);
        } else {
            console.error('Error fetching questions:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>${question.question}</p>
            <form>
                ${question.options.map((option, optionIndex) => `
                    <label>
                        <input type="radio" name="option-${index}" value="${option}" />
                        ${option}
                    </label>
                `).join('')}
            </form>
            <button id="submit-button-${index}" onclick="submitAnswer(${index})">Submit Answer</button>
        `;
        questionsContainer.appendChild(questionElement);
    });
}

// Fetch questions when the page loads
fetchQuestions();