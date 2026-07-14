const question = document.getElementById("question");
const buttons = document.querySelectorAll(".button");

let testData = null;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadQuestion(testData) {
  if (testData) {
    let ThemeRandom = getRandomInt(1, 63);

    const section = testData.sections.find((s) => s.number === ThemeRandom);
    let QuestionRandom = getRandomInt(1, section.questions.length);

    let questionText = section.questions.find(
      (q) => q.number === QuestionRandom,
    );

    question.textContent = questionText.question;
    buttons.forEach((button, index) => {
      if (index < questionText.options.length) {
        button.style.display = "inline-block";
        button.textContent = questionText.options[index].text;
      } else {
        button.style.display = "none";
      }
    });

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

fetch("tests.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Помилка завантаження файлу");
    }
    return response.json();
  })
  .then((data) => {
    testData = data;
    loadQuestion(testData);
  })
  .catch((error) => {
    console.error("Виникла помилка:", error);
  });
