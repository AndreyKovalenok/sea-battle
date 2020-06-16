import { Playground } from './Playground.js';

const userNameForm = document.querySelector('.user-name');
const startButton = userNameForm.querySelector('.user-name__button');
const battlefiled = document.querySelector('.battlefield');

const startGame = () => {
  userNameForm.classList.add('user-name--disabled');
  battlefiled.classList.add('battlefield--active');
  user.randomLocationShips();
};
startButton.addEventListener('click', () => {startGame()});

const userPlayground = battlefiled.querySelector('.fields--user');
const user = new Playground(userPlayground, 'user'); 