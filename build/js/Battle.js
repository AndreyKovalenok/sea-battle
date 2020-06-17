// export class Battle {
//   /**
//    * Метод, генерирующий случайное число от 0 до max
//    * @param {number} max - максимальне необходимое число 
//    */
//   getRandomNumber(max) {Math.floor(Math.random() * max)};  

//   init() {
//     console.log(this);
//     this.self = this.battle;

//     this.player = this.getRandomNumber(1) === 0 ? this.user : this.comp;
//     this.enemy = this.player === this.user ? this.comp : this.user;

//     if (this.player === this.user) {
//       this.comp.playground.addEventListener('click', this.self.shoot);
//       this.comp.playground.addEventListener('contextmenu', this.self.setEmptyCell);
//       this.self.showServiseText('Вы стреляете первым.');
//     }
//   }

//   showServiseText(text) {
//     this.battlefiledNotification.innerHTML = '';
//     this.battlefiledNotification.innerHTML = text;
//   }

//   setEmptyCell(evt) {
//     if (evt.button != 2) return false;
//     evt.preventDefault();

//     const coordinates = this.self.transformCoordinates(evt, this.comp);
//     const isCheckedCell = this.self.checkCell();

//     if (isCheckedCell) {
//       this.self.showIcons(enemy, coordinates, 'shaded-cell');
//       this.comp.matrix[coordinates.x][coordinates.y];
//     }
//   }

//   checkCell() {
//     const icons = this.enemy.field.querySelector('.icon-field');
//     let flag = true;

//     [].forEach.call(icons, (el) => {
//       const x = el.style.top.slice(0, -2) / this.comp.deckSize;
//       const y = el.style.left.slice(0, -2) / this.comp.deckSize;

//       if (coordinates.x === x && coordinates.y === y) {
//         const isShaded = el.classList.contains('shaded-cell');

//         if (isShaded) {
//           el.parentNode.removeChild(el);
//           this.comp.matrix[coordinates.x][coordinates.y] = 0;
//         }

//         flag = false;
//       }
//     })
//     return flag;
//   }

//   shoot(evt) {
//     let coordinates = null;
//     if (evt !== undefined) {
//       if (evt.button !== 0) return false;

//       coordinates = this.self.transformCoordinates(evt, this.enemy);
//     } 
//     else {
//       coordinates = {x: 1, y: 1}
//       // coordinates = this.comp.shootMatrixAround.length 
//       //   ? this.self.getCoordinateshShotAround 
//       //   : this.self.getCoordinatesShoor(); 
//     }
//     const val = this.enemy.matrix[coordinates.x][coordinates.y];

//     switch (val) {
//       case 0:
//         this.self.showIcons(this.enemy, coordinates, 'dot');
//         this.enemy.matrix[coordinates.x][coordinates.y] = 3;
        
//         this.text = this.player === this.user 
//           ? 'Вы промахнулись. Стреляет компьютер'
//           : 'Компьютер промахнулся. Ваш выстрел';
//         this.self.showServiseText(this.text);

//         this.player = this.player === this.user ? this.comp : this.user;
//         this.enemy = this.player === this.user ? this.comp : this.user;

//         if (this.player === this.comp) {
//           this.comp.playground.removeEventListener('click', this.self.shoot);
//           this.comp.playground.removeEventListener('contextmenu', this.self.setEmptyCell);

//           setTimeout(() =>  {
//             return this.self.shoot();
//           }, 1000);
//         } else {
//           this.comp.playground.addEventListener('click', this.self.shoot);
//           this.comp.playground.addEventListener('contextmenu', this.self.setEmptyCell);
//         }
//         break;

//       case 1: 
//         this.enemy.matrix[coordinates.x][coordinates.y] = 4;
//         this.self.showIcons(this.enemy, coordinates, 'red-cross');
//         this.text = this.player === this.user
//           ? 'Поздравялем! Вы попали. Ваш выстрел'
//           : 'Компьютер попал в ваш корабль. Выстрел компьютера';
//         this.self.showServiseText(this.text);

//         for (let i = this.enemy.squadron.length - 1; i >= 0; i--) {
//           let warship = this.enemy.squadron[i];
//           let arrayDescks = warship.matrix;

//           for (let j = 0, length = arrayDescks.length; j < length; j++) {
//             if (arrayDescks[j][0] === coordinates.x && arrayDescks[j][1] === coordinates.y) {
//               warship.hits++;

//               if (warship.hits === warship.decks) {
//                 this.enemy.squadron.splice(i, i);
//               }
//               break;
//             }
//           }
//         }

//         if (this.enemy.squadron.length === 0) {
//           this.text = this.player === this.user 
//             ? 'Поздравляем! Вы выиграли'
//             : 'К сожалению, вы проиграли'

//             if (this.player === this.user) {
//               this.comp.playground.removeEventListener('click', this.self.shoot);
//               this.comp.playground.removeEventListener('contextmenu', this.self.setEmptyCell);
//             }
//         }
//         break;

//       case 2: 
//         this.text = 'Снимите блокировку с этих координат!';
//         this.self.showServiseText(this.text);

//         const icons = this.enemy.playground.querySelectorAll('.shaded-cell');

//         [].forEach.call(icons, (el) => {
//           const x = el.style.top.slice(0, -2) / this.comp.deckSize;
//           const y = el.style.left.slice(0, -2) / this.comp.deckSize;

//           if (coordinates.x === x && coordinates.y === y) {
//             el.classList.add('shaded-cell_red');
//             setTimeout(() => {
//               el.classList.remove('shaded-cell_red');
//             }, 500)
//           }
//         })
//         break;

//       case 3: 
//       case 4: 
//         this.text = 'По этим координатам вы уже стреляли!'
//         this.self.showServiseText(this.text);
//         break;
//     }
//   }

//   transformCoordinates(evt, enemy) {
//     const obj = {};
//     obj.x = Math.trunc((evt.pageX - enemy.playground.getBoundingClientRect().left) / enemy.deckSize);
//     obj.y = Math.trunc((evt.pageY - enemy.playground.getBoundingClientRect().top) / enemy.deckSize);
//     return obj;
//   }

//   showIcons(enemy, coords, iconClass) {
//     console.log(coords);
//     const div = document.createElement('div');
//     div.className = 'icon-field ' + iconClass;
//     div.style.cssText = `left: ${coords.x * enemy.deckSize}px; top: ${coords.y * enemy.deckSize}px;`;
//     enemy.playground.appendChild(div);
//   }
// }