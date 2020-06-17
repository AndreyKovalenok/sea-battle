import { Playground } from './Playground.js';
import { Controller } from './Controller.js';

const userNameForm = document.querySelector('.user-name');
const startButton = userNameForm.querySelector('.user-name__button');
const battlefiled = document.querySelector('.battlefield');

const startGame = () => {
  userNameForm.classList.add('user-name--animation');
  battlefiled.classList.add('battlefield--active');
  
  user.randomLocationShips();
  comp.randomLocationShips();

  const controller = new Controller(user, comp);
  controller.init();
};

startButton.addEventListener('click', () => {
  startButton.addEventListener('transitionend', () => {
    userNameForm.classList.add('user-name--disabled');
    battlefiled.classList.add('battlefield--animation');
  });
  startGame();
});

const userPlayground = battlefiled.querySelector('.fields--user');
const compPlayground = battlefiled.querySelector('.fields--comp');

const user = new Playground(userPlayground, 'user'); 
const comp = new Playground(compPlayground, 'comp');


