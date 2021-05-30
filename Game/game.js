var winWidth = $(window).width();
var ratio = winWidth / 1920;
var fontSize = {
  small: 12,
  medium: 14,
};
var played = [0, 0, 0];
var vara = [];
var bodyFontSize = Math.max(16 * ratio, 10);
var posX = Math.max(80 * ratio, 30);
$('body').css('font-size', bodyFontSize + 'px');
fontSize.small = Math.max(fontSize.small * ratio, 7);
fontSize.medium = Math.max(fontSize.medium * ratio, 10);

vara[0] = new Vara(
  '#vara-container',
  'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
  [
    {
      text: 'Airy Pages Game',
      textAlign: 'right',
      y: 20,
      x: 45,
      delay: 500,
      duration: 1500,
      fontSize: fontSize.small,
    },
    {
      text: 'Start the year with something cool.',
      y: 40,
      x: posX,
      duration: 3000,
    },
    {
      text: 'Like with a library,',
      id: 'sphinx',
      x: posX,
      delay: 1000,
      duration: 4500,
    },
    {
      text: '..... that can animate text writing',
      id: 'end',
      color: '#3f51b5',
      delay: 1000,
      x: posX,
      duration: 4500,
    },
  ],
  {
    strokeWidth: 2,
    fontSize: fontSize.medium,
    autoAnimation: false,
  }
);
vara[1] = new Vara(
  '#vara-container2',
  'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
  [
    {
      text: 'Your father gifted you a beautiful pen on your birthday,And one of your friend broke your pen. How should you feel about it?',
      textAlign: 'left',
      delay: 500,
      y: 20,
      x: 45,
      duration: 1500,
      fontSize: fontSize.small,
    },
    {
      text: 'Your Options are:',
      y: 40,
      x: posX,
      duration: 3000,
    },
    {
      text: '1)Angry or 2)Happy?',
      y: 40,
      x: posX,
      color: '#3f51b5',
      duration: 3500,
    },
  ],
  {
    strokeWidth: 2,
    fontSize: fontSize.medium,
    autoAnimation: false,
  }
);
vara[2] = new Vara(
  '#vara-container3',
  'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
  [
    {
      text: 'You had a pet dog whose name was Rex. He was sick since last two weeks. And after some days he died. How should you feel about it?',
      textAlign: 'left',
      delay: 500,
      y: 20,
      x: 45,
      duration: 1500,
      fontSize: fontSize.small,
    },
    {
      text: 'Your Options Are:',
      y: 40,
      x: posX,
      duration: 3000,
    },
    {
      text: '1)Surprised or 2)Sad?',
      y: 20,
      x: posX,
      color: '#3f51b5',
      duration: 2500,
    },
  ],
  {
    strokeWidth: 2,
    fontSize: fontSize.medium,
    autoAnimation: false,
  }
);

vara[3] = new Vara(
  '#vara-container4',
  'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
  [
    {
      text: "One day I got late for my school. I was expecting to get scolded by our teacher but instead I got praised for helping the old lady to cross the road. I wasn't expecting that. How should I feel about this?",
      textAlign: 'left',
      delay: 500,
      y: 20,
      x: 45,
      duration: 1500,
      fontSize: fontSize.small,
    },
    {
      text: 'Your Options Are:',
      y: 40,
      x: posX,
      duration: 3000,
    },
    {
      text: '1)Angry or 2)Surprised?',
      y: 20,
      color: '#3f51b5',
      x: posX,
      duration: 2500,
    },
  ],
  {
    strokeWidth: 2,
    fontSize: fontSize.medium,
    autoAnimation: false,
  }
);

vara[4] = new Vara(
  '#vara-container5',
  'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
  [
    {
      text: 'I studied hard for his test. And he scored good marks in the test. How would I feel about this?',
      textAlign: 'left',
      delay: 500,
      y: 20,
      x: 45,
      duration: 1500,
      fontSize: fontSize.small,
    },
    {
      text: 'Your Options are:',
      y: 40,
      x: posX,
      duration: 3000,
    },
    {
      text: '1)Happy or 2)Angry?',
      y: 20,
      color: '#3f51b5',
      x: posX,
      duration: 2500,
    },
  ],
  {
    strokeWidth: 2,
    fontSize: fontSize.medium,
    autoAnimation: false,
  }
);
// vara[5] = new Vara(
//   '#vara-container6',
//   'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
//   [
//     {
//       text: '17 Jan 2019',
//       textAlign: 'right',
//       delay: 500,
//       y: 20,
//       x: -30,
//       duration: 1500,
//       fontSize: fontSize.small,
//     },

//     {
//       text: 'Github.',
//       y: 10,
//       color: '#3f51b5',
//       id: 'link',
//       x: posX,
//       duration: 1500,
//     },
//   ],
//   {
//     strokeWidth: 2,
//     fontSize: fontSize.medium,
//     autoAnimation: false,
//   }
// );

vara[2].ready(function () {
  $('.front:not(.last)').click(function pageTurn() {
    var ix = $(this).parent('.paper').index();
    $('.book').addClass('open');
    $(this).parent('.paper').addClass('open');
    if (!played[ix]) {
      vara[ix].playAll();
      vara[ix].animationEnd(function (i, o) {
        played[ix] = 1;
        if (i == 'link') {
          var group = o.container;
          var rect = vara[2].createNode('rect', {
            x: 0,
            y: 0,
            width: o.container.getBoundingClientRect().width,
            height: o.container.getBoundingClientRect().height,
            fill: 'transparent',
          });
          group.appendChild(rect);
          $(rect).css('cursor', 'pointer');
          $(rect).click(function () {
            console.log(true);
            document.querySelector('#link').click();
          });
        }
      });
    }
  });

  // Logic for Going Back on Pages
  $('.back').click(function () {
    if ($(this).parent('.paper').index() == 0) $('.book').removeClass('open');
    $(this).parent('.paper').removeClass('open');
  });
});

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

function evaluate() {
  if (form.op.value == questions[qno].answer) {
    res.setAttribute('class', 'correct');
    res.innerHTML = 'Correct';
    score += questions[qno].score;
  } else {
    res.setAttribute('class', 'incorrect');
    res.innerHTML = 'Incorrect';
  }
  document.querySelectorAll('[type="button"]').forEach((button) => {
    button.setAttribute('disabled', '');
  });
}

function getNextQuestion() {
  qno++;
  ques = questions[qno];
  $('.front:not(.last)').click(function pageTurn() {
    var ix = $(this).parent('.paper').index();
    $('.book').addClass('open');
    $(this).parent('.paper').addClass('open');
    if (!played[ix]) {
      vara[ix].playAll();
      vara[ix].animationEnd(function (i, o) {
        played[ix] = 1;
        if (i == 'link') {
          var group = o.container;
          var rect = vara[2].createNode('rect', {
            x: 0,
            y: 0,
            width: o.container.getBoundingClientRect().width,
            height: o.container.getBoundingClientRect().height,
            fill: 'transparent',
          });
          group.appendChild(rect);
          $(rect).css('cursor', 'pointer');
          $(rect).click(function () {
            console.log(true);
            document.querySelector('#link').click();
          });
        }
      });
    }
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

    form.submit.classList.remove('next');
    form.submit.value = 'Submit';
    form.submit.classList.add('submit');
    form.reset();
  } else if (form.submit.classList.contains('next')) {
    form.submit.classList.remove('next');
    form.submit.value = 'Submit';
    form.submit.classList.add('submit');
    form.reset();
  }
}
function init() {
  form = document.querySelector('form-control');
  res = document.querySelector('#res');
  qno = -1;
  score = 0;
  form.addEventListener('submit', handleSubmit);
  form.addEventListener('click', init);
  getNextQuestion();
}
document.querySelector('button').addEventListener('click', init);
init();
