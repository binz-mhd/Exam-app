document.addEventListener('DOMContentLoaded', function () {
    const adminForm = document.getElementById('admin-form');
    const successModal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const questionsList = document.getElementById('questions-list');
    const clearQuestionsButton = document.getElementById('clear-questions');

    if (adminForm) {
        adminForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const question = document.getElementById('question').value;
            const options = document.getElementById('options').value.split(',');
            const correctAnswer = document.getElementById('correctAnswer').value;

            fetch('/api/addQuestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, options, correctAnswer }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Display success modal
                    successMessage.textContent = 'Question successfully submitted!';
                    successModal.style.display = 'block';

                    // Clear form fields
                    adminForm.reset();

                    // Fetch and display added questions
                    fetchAddedQuestions();
                } else {
                    console.error('Error adding question:', data.error);
                }
            })
            .catch(error => {
                console.error('Error adding question:', error);
            });
        });
    }

    // Close success modal when the close button is clicked
    const closeModalButton = document.querySelector('.close');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function () {
            successModal.style.display = 'none';
        });
    }

    // Fetch and display added questions on page load
    fetchAddedQuestions();

    // Clear all questions button click event
    if (clearQuestionsButton) {
        clearQuestionsButton.addEventListener('click', function () {
            fetch('/api/clearQuestions', {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Display success modal
                    successMessage.textContent = 'All questions cleared!';
                    successModal.style.display = 'block';

                    // Fetch and display added questions
                    fetchAddedQuestions();
                } else {
                    console.error('Error clearing questions:', data.error);
                }
            })
            .catch(error => {
                console.error('Error clearing questions:', error);
            });
        });
    }
});

// Function to fetch and display added questions
function fetchAddedQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(questions => {
            const questionsTableBody = document.getElementById('questions-table-body');
            questionsTableBody.innerHTML = '';

            questions.forEach(question => {
                const row = document.createElement('tr');

                // Column 1: Added Questions
                const questionCell = document.createElement('td');
                questionCell.textContent = question.question;
                row.appendChild(questionCell);

                // Column 2: Actions (Delete)
                const actionsCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteQuestion(question._id);
                });
                actionsCell.appendChild(deleteButton);
                row.appendChild(actionsCell);

                questionsTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching added questions:', error);
        });
}

// Function to delete a question
function deleteQuestion(questionId) {
    fetch(`/api/question/${questionId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Display success modal
            const successModal = document.getElementById('success-modal');
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = 'Question successfully deleted!';
            successModal.style.display = 'block';

            // Fetch and display added questions
            fetchAddedQuestions();
        } else {
            console.error('Error deleting question:', data.error);
        }
    })
    .catch(error => {
        console.error('Error deleting question:', error);
    });
}
