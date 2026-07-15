const question = document.getElementById("question");
const buttons = document.querySelectorAll(".button");

let testData = null;
let answerData = null;
let ThemeRandom = null;
let QuestionRandom = null;
let corectAnswer = null;

Promise.all([
  fetch("tests.json").then((res) => {
    if (!res.ok) throw new Error("Помилка завантаження tests.json");
    return res.json();
  }),
  fetch("answers.json").then((res) => {
    if (!res.ok) throw new Error("Помилка завантаження answers.json");
    return res.json();
  }),
])
  .then(([tests, answers]) => {
    testData = tests;
    answerData = answers;

    loadQuestion(testData);
    findCorrectAnswer();
  })
  .catch((error) => {
    console.error("Виникла помилка при завантаженні даних:", error);
  });

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadQuestion(testData) {
  if (testData && testData.sections && testData.sections.length > 0) {
    // 1. Вибираємо випадковий ІНДЕКС секції (від 0 до кількості секцій - 1)
    const randomSectionIndex = getRandomInt(0, testData.sections.length - 1);
    const section = testData.sections[randomSectionIndex];

    // Запам'ятовуємо РЕАЛЬНИЙ номер теми
    ThemeRandom = section.number;

    if (section.questions && section.questions.length > 0) {
      // 2. Вибираємо випадковий ІНДЕКС питання в цій секції
      const randomQuestionIndex = getRandomInt(0, section.questions.length - 1);
      const questionText = section.questions[randomQuestionIndex];

      // Запам'ятовуємо РЕАЛЬНИЙ номер питання
      QuestionRandom = questionText.number;

      // Відображаємо текст питання
      question.textContent = questionText.question;

      // Налаштовуємо кнопки відповідей
      buttons.forEach((button, index) => {
        if (index < questionText.options.length) {
          button.style.display = "inline-block";
          button.textContent = questionText.options[index].text;
          button.dataset.number = index + 1;
        } else {
          button.style.display = "none";
        }
      });

      // Логіка для зображень
      const container = document.getElementById("image-container");
      const oldImages = container.querySelectorAll("img");
      oldImages.forEach((img) => img.remove());

      if (questionText.images && questionText.images.length > 0) {
        questionText.images.forEach((imgName) => {
          const newImg = document.createElement("img");
          newImg.src = `/images/${imgName}`;

          if (questionText.images.length === 1) {
            newImg.classList.add("large-image");
          } else {
            newImg.classList.add("small-image");
          }
          container.appendChild(newImg);
        });
      }
    }
  }
}

function findCorrectAnswer() {
  const themeNumber = answerData.find((s) => s.number === ThemeRandom);
  const questionAnswer = themeNumber.questions.find(
    (q) => q.number === QuestionRandom,
  );
  corectAnswer = questionAnswer.answer;

  console.log("Correct answer:", corectAnswer);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.number == corectAnswer) {
      alert("Вірно!");
    } else {
      alert("Невірно!");
    }
  });
});
