let question;
let form;
let res;
let qno;
let score;

const questions = [
  {
    title:
      'Your father gifted you a beautiful pen on your birthday. And one of your friend broke your pen. How should you feel about it?',
    options: ['Angry', 'Happy'],
    answer: '0',
    score: 1,
  },
  {
    title:
      'You had a pet dog whose name was Rex. He was sick since last two weeks. And after some days he died. How should you feel about it?',
    options: ['Surprised', 'Sad'],
    answer: '1',
    score: 1,
  },
  {
    title:
      "One day I got late for my school. I was expecting to get scolded by our teacher but instead I got praised for helping the old lady to cross the road. I wasn't expecting that. How should I feel about this?",
    options: ['Angry', 'Surprised'],
    answer: '1',
    score: 1,
  },
  {
    title:
      'I studied hard for his test. And he scored good marks in the test. How would I feel about this?',
    options: ['Happy', 'Angry'],
    answer: '0',
    score: 1,
  },
  // {
  //   title:
  //   options:
  //   answer:
  //   score:
  // },
  // {
  //   title:

  //   options:
  //   answer:
  //   score:
  // },
  // {
  //   title:
  //   options:

  //   answer:
  //   score:
  // },
  // {
  //   title:
  //   options:
  //   answer:
  //   score:
  // },
  // {
  //   title:
  //   options: [

  //   ],
  //   answer:
  //   score:
  // },
  // {
  //   title:
  //   options:
  //   answer:
  //   score:
  // },
];

function restartScreen() {
  document.querySelector('.quiz-heading').innerHTML = `Score : ${score}`;
  document.querySelector('button').style.display = 'block';
}

function evaluate() {
  if (form.op.value == questions[qno].answer) {
    res.setAttribute('class', 'correct');
    res.innerHTML = 'Correct';
    score += questions[qno].score;
  } else {
    res.setAttribute('class', 'incorrect');
    res.innerHTML = 'Incorrect';
  }
  document.querySelectorAll('[type="radio"]').forEach((radio) => {
    radio.setAttribute('disabled', '');
  });
}

function getNextQuestion() {
  qno++;
  ques = questions[qno];
  question.innerHTML = ques.title;
  const labels = document.querySelectorAll('label');
  labels.forEach((label, idx) => {
    label.innerHTML = ques.options[idx];
  });
}

function handleSubmit(e) {
  e.preventDefault();
  if (!form.op.value) {
    alert('Please select an option');
  } else if (form.submit.classList.contains('submit')) {
    evaluate();
    form.submit.classList.remove('submit');
    form.submit.value = 'Next';
    form.submit.classList.add('next');
  } else if (
    qno < questions.length - 1 &&
    form.submit.classList.contains('next')
  ) {
    getNextQuestion();
    resetradio();
    form.submit.classList.remove('next');
    form.submit.value = 'Submit';
    form.submit.classList.add('submit');
    form.reset();
  } else if (form.submit.classList.contains('next')) {
    restartScreen();
    form.submit.classList.remove('next');
    form.submit.value = 'Submit';
    form.submit.classList.add('submit');
    form.reset();
  }
}
function init() {
  document.body.innerHTML = `
        
    `;
  question = document.querySelector('#question');
  form = document.querySelector('form');
  res = document.querySelector('#res');
  qno = -1;
  score = 0;
  form.addEventListener('submit', handleSubmit);
  document.querySelector('button').addEventListener('click', init);
  getNextQuestion();
}
document.querySelector('button').addEventListener('click', init);
init();
