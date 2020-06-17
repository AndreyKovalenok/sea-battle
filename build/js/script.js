import { Playground } from './Playground.js';
import { Controller } from './Controller.js';

const userNameForm = document.querySelector('.user-name');
const startButton = userNameForm.querySelector('#start');
const refreshButton = document.querySelector('#refresh');
const battlefiled = document.querySelector('.battlefield');
console.log(refreshButton);

const startGame = () => {
  userNameForm.classList.add('user-name--animation');
  battlefiled.classList.add('battlefield--active');
  
  user.randomLocationShips();
  comp.randomLocationShips();

  controller.init();
};

startButton.addEventListener('click', () => {
  startButton.addEventListener('transitionend', () => {
    userNameForm.classList.add('user-name--disabled');
    battlefiled.classList.add('battlefield--animation');
  });
  startGame();
});

refreshButton.addEventListener('click', () => {
  userPlayground.innerHTML = '';
  compPlayground.innerHTML = '';
  user.randomLocationShips();
  comp.randomLocationShips();
  controller.init();
  refreshButton.classList.remove('battlefield__button--active');
})

const userPlayground = battlefiled.querySelector('.fields--user');
const compPlayground = battlefiled.querySelector('.fields--comp');

const user = new Playground(userPlayground, 'user'); 
const comp = new Playground(compPlayground, 'comp');
const controller = new Controller(user, comp, refreshButton);



