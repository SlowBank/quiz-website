document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('click', login);
    document.getElementById('register').addEventListener('click', register);
    document.getElementById('guest').addEventListener('click', guestLogin);
    document.getElementById('try-again').addEventListener('click', resetQuiz);
    document.getElementById('go-back').addEventListener('click', goBackToMainPage);
    checkLogin();
});

const questionPool = [
    {
        question: "What is the capital of France?",
        answers: {
            A: "Berlin",
            B: "Madrid",
            C: "Paris",
            D: "Rome"
        },
        correctAnswer: "C"
    },
    {
        question: "What is 2 + 2?",
        answers: {
            A: "3",
            B: "4",
            C: "5",
            D: "6"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: {
            A: "Earth",
            B: "Mars",
            C: "Jupiter",
            D: "Saturn"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the smallest prime number?",
        answers: {
            A: "1",
            B: "2",
            C: "3",
            D: "5"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the chemical symbol for water?",
        answers: {
            A: "H2O",
            B: "O2",
            C: "CO2",
            D: "NaCl"
        },
        correctAnswer: "A"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answers: {
            A: "Harper Lee",
            B: "Mark Twain",
            C: "Ernest Hemingway",
            D: "F. Scott Fitzgerald"
        },
        correctAnswer: "A"
    },
    {
        question: "What is the speed of light?",
        answers: {
            A: "300,000 km/s",
            B: "150,000 km/s",
            C: "450,000 km/s",
            D: "600,000 km/s"
        },
        correctAnswer: "A"
    },
    {
        question: "What is the capital of Japan?",
        answers: {
            A: "Beijing",
            B: "Seoul",
            C: "Tokyo",
            D: "Bangkok"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the square root of 64?",
        answers: {
            A: "6",
            B: "7",
            C: "8",
            D: "9"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: {
            A: "Atlantic Ocean",
            B: "Indian Ocean",
            C: "Arctic Ocean",
            D: "Pacific Ocean"
        },
        correctAnswer: "D"
    },
    // Add more questions to the pool as needed
];

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = [];
let incorrectAnswers = [];
let currentUser = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectRandomQuestions() {
    shuffle(questionPool);
    questions = questionPool.slice(0, 10); // Select 10 random questions
}

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const buttons = document.querySelectorAll('#quiz-container button');
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    buttons[0].textContent = `A. ${currentQuestion.answers.A}`;
    buttons[1].textContent = `B. ${currentQuestion.answers.B}`;
    buttons[2].textContent = `C. ${currentQuestion.answers.C}`;
    buttons[3].textContent = `D. ${currentQuestion.answers.D}`;

    buttons.forEach(button => {
        button.disabled = false;
        button.onclick = () => checkAnswer(button.textContent.charAt(0), button);
    });
}

function checkAnswer(answer, button) {
    const result = document.getElementById('result');
    const currentQuestion = questions[currentQuestionIndex];

    if (answer === currentQuestion.correctAnswer) {
        result.textContent = 'Correct!';
        result.style.color = 'green';
        correctAnswers.push(currentQuestion.question);
    } else {
        result.textContent = 'Incorrect. Moving to next question.';
        result.style.color = 'red';
        incorrectAnswers.push(currentQuestion.question);
    }

    disableButtons();

    setTimeout(() => {
        result.textContent = '';
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
            updateQuizCount();
        } else {
            showCongratulations();
        }
    }, 2000);
}

function disableButtons() {
    const buttons = document.querySelectorAll('#quiz-container button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function updateQuizCount() {
    const quizCountElement = document.getElementById('quiz-count');
    quizCountElement.textContent = `Quiz ${currentQuestionIndex + 1} of ${questions.length}`;
}

function showCongratulations() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('congratulations').style.display = 'block';

    const summary = document.getElementById('summary');
    summary.innerHTML = `<p>You got ${correctAnswers.length} out of ${questions.length} questions right.</p>`;
    summary.innerHTML += `<p>Correct Answers:</p><ul>${correctAnswers.map(q => `<li>${q}</li>`).join('')}</ul>`;
    summary.innerHTML += `<p>Incorrect Answers:</p><ul>${incorrectAnswers.map(q => `<li>${q}</li>`).join('')}</ul>`;

    const score = (correctAnswers.length / questions.length) * 100;
    document.getElementById('score').textContent = `Your score: ${score.toFixed(2)}%`;

    if (currentUser) {
        localStorage.setItem(`${currentUser}_score`, score);
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = [];
    incorrectAnswers = [];
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('congratulations').style.display = 'none';
    selectRandomQuestions();
    loadQuestion();
    updateQuizCount();
}

function goBackToMainPage() {
    window.location.href = '../index.html';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        currentUser = username;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        selectRandomQuestions();
        loadQuestion();
        updateQuizCount();
        loadScore();
    } else {
        document.getElementById('login-message').textContent = 'Invalid username or password.';
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (localStorage.getItem(username)) {
        document.getElementById('login-message').textContent = 'Username already exists.';
    } else {
        localStorage.setItem(username, password);
        document.getElementById('login-message').textContent = 'Registration successful. Please log in.';
    }
}

function guestLogin() {
    currentUser = 'guest';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    selectRandomQuestions();
    loadQuestion();
    updateQuizCount();
}

function checkLogin() {
    if (currentUser) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        selectRandomQuestions();
        loadQuestion();
        updateQuizCount();
        loadScore();
    }
}

function loadScore() {
    const score = localStorage.getItem(`${currentUser}_score`);
    if (score) {
        document.getElementById('score').textContent = `Your last score: ${score}%`;
    }
}
