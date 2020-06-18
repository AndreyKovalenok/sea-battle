import { Playground } from './Playground.js';
import { Controller } from './Controller.js';

// Получение узлов игровых полей и кнопки перезпуска игры из разметки
const battlefiled = document.querySelector('.battlefield');
const userPlayground = battlefiled.querySelector('.fields--user');
const compPlayground = battlefiled.querySelector('.fields--comp');
const refreshButton = battlefiled.querySelector('#refresh');

// Получение узлов поля ввода имени и начала игры
const userNameForm = document.querySelector('.user-name');
const startButton = userNameForm.querySelector('#start');
const nameInput = userNameForm.querySelector('.user-name__input');
const errorText = userNameForm.querySelector('.user-name__error-message');

/**
 * Метод, запускающий игру
 */
const startGame = () => {
  userNameForm.classList.add('user-name--animation');
  battlefiled.classList.add('battlefield--active');
  
  // Формирование виртуальных полей игрока и компьютера и отображение кораблей игрока на экране
  user.randomLocationShips();
  comp.randomLocationShips();

  // Активация контроллера
  controller.setUserName(userName);
  controller.init();
};

startButton.addEventListener('click', () => {
  if (userName.length < 3) {
    if (!nameInput.classList.contains('user-name__input--error')) {
      nameInput.classList.add('user-name__input--error');
    }
    if (!errorText.classList.contains('user-name__error-message--error')) {
      errorText.classList.add('user-name__error-message--error');
    }
  } else {
    startButton.addEventListener('transitionend', () => {
      userNameForm.classList.add('user-name--disabled');
      battlefiled.classList.add('battlefield--animation');
    });
    startGame();
  }
});

refreshButton.addEventListener('click', () => {
  userPlayground.innerHTML = '';
  compPlayground.innerHTML = '';
  user.randomLocationShips();
  comp.randomLocationShips();
  controller.init();
  refreshButton.classList.remove('battlefield__button--active');
})


let userName = '';
nameInput.addEventListener('input', () => {
  userName = nameInput.value;
  if (nameInput.classList.contains('user-name__input--error')) {
    nameInput.classList.remove('user-name__input--error');
  }
  if (errorText.classList.contains('user-name__error-message--error')) {
    errorText.classList.remove('user-name__error-message--error');
  }
})

// Создание сущностей игрока, компьюера и контроллера
const user = new Playground(userPlayground, 'user'); 
const comp = new Playground(compPlayground, 'comp');
const controller = new Controller(user, comp, refreshButton, );



