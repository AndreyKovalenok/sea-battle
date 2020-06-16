import { Playground } from './Playground.js';

const userNameForm = document.querySelector('.user-name');
const startButton = userNameForm.querySelector('.user-name__button');
const battlefiled = document.querySelector('.battlefield');

const startGame = () => {
  userNameForm.classList.add('user-name--animation');
  battlefiled.classList.add('battlefield--active');
  
  user.randomLocationShips();
  comp.randomLocationShips();
};

startButton.addEventListener('click', () => {
  startGame()
  startButton.addEventListener('transitionend', () => {
    userNameForm.classList.add('user-name--disabled');
    battlefiled.classList.add('battlefield--animation');
  });
});

const userPlayground = battlefiled.querySelector('.fields--user');
const compPlayground = battlefiled.querySelector('.fields--comp');

const user = new Playground(userPlayground, 'user'); 
const comp = new Playground(compPlayground, 'comp'); 