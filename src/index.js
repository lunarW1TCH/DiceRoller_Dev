import { MAX_DICE_INPUT, MIN_DICE_INPUT, SLEEP_TIME_MS } from './config';
import randomInteger from 'random-int';
import { convertIndexIntoDiceSides, paths } from './helpers';
import { convertIndexIntoDiceSides } from './helpers';

// DOM elements
const form = document.querySelector('.controlPanel__form');
const btnRoll = document.querySelector('.form__btn');
const results = document.querySelector('.container__results');
const resultsMsg = document.querySelector('.container__results--span');
const colorModeBtn = document.querySelector('.icon__btn--moon');
const darkStylesheet = document.getElementById('dark__stylesheet');
// paths to dice icons from the parcel build
const dicePaths = paths();

class App {
  #firstRoll = true;
  #darkMode = false;

  constructor() {
    // attach event listeners
    form.addEventListener('submit', this._formHandler.bind(this));
    form.addEventListener('click', this._plusMinusHandler.bind(this));
    btnRoll.addEventListener('click', this._btnRollHandler.bind(this));
    colorModeBtn.addEventListener('click', this._colorModeHandler.bind(this));
  }

  // events

  _colorModeHandler(e) {
    // enables and disables dark mode

    if (this.#darkMode) {
      darkStylesheet.disabled = true;
      this.#darkMode = false;
    } else {
      darkStylesheet.disabled = false;
      this.#darkMode = true;
    }
  }

  _formHandler(e) {
    e.preventDefault();
  }

  _btnRollHandler(e) {
    //checks if clicked element was roll! button
    if (e.target === btnRoll) {
      // converts html collection of all elements with dice_amount class from form into an array
      const inputs = Array.from(
        form.getElementsByClassName('inputContainer__input')
      );
      const diceValues = [];

      // pushes dice values in order (d4, d6 ...) into diceValues
      inputs.forEach(el => diceValues.push(+el.value));

      const initialValue = 0;
      const sum = diceValues.reduce((sum, el) => sum + el, initialValue);
      if (sum !== 0) {
        this._renderRoll(diceValues);
      }
    }
  }

  // handles plus and minus buttons
  _plusMinusHandler(e) {
    const btn = e.target;
    const diceInput = btn.closest('.inputContainer').children[3];

    // restricts input values to min and max
    diceInput.addEventListener('change', function () {
      if (this.value < MIN_DICE_INPUT) this.value = MIN_DICE_INPUT;
      if (this.value > MAX_DICE_INPUT) this.value = MAX_DICE_INPUT;
    });

    // if button is minus then subtract 1 from input
    if ([...btn.classList].includes('icon__btn--minus')) {
      console.log('minus');
      if (diceInput.value > MIN_DICE_INPUT) {
        diceInput.value--;
      }
    }

    // if button is plus then add 1 to input
    if ([...btn.classList].includes('icon__btn--plus')) {
      console.log('plus');
      if (diceInput.value < MAX_DICE_INPUT) {
        diceInput.value++;
      }
    }
  }

  // stops execution of code
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // returns an array of rolls for every dice in the form
  _getRolls(diceValues) {
    const rolls = [];

    diceValues.forEach(function (element, index) {
      if (element !== 0) {
        const sides = convertIndexIntoDiceSides(index);
        for (let i = 0; i < element; i++) {
          rolls.push([sides, randomInteger(1, sides)]);
        }
      }
    });

    return rolls;
  }

  // toggles spin on dice icons
  _renderSpin() {
    const icons = Array.from(form.getElementsByClassName('icon--dice'));
    console.log(icons);
    icons.forEach(function (icon) {
      icon.classList.toggle('rotate');
    });
  }

  async _renderRoll(diceValues) {
    // [[diceSides, rollValue], [diceSides, rollValue], ...]
    const rolls = this._getRolls(diceValues);
    console.log(rolls);

    // after sleep time, spin animation stops and the results show up
    this._renderSpin();
    await this._sleep(SLEEP_TIME_MS);
    this._renderSpin();

    // hides 'your rolls will show up here' message
    if (this.#firstRoll) {
      resultsMsg.classList.add('hidden');
      this.#firstRoll = false;
    }

    // html element which displays each dice and roll of the rolls array
    let html = `<div class="container__box container__box--dark results__rollContainer">`;
    rolls.forEach(function (roll) {
      html += `<div class="results__rollContainer--roll"><img class="icon icon--dark icon--dice" src="${
        dicePaths[`${roll.at(0)}`]
      }"/>
      <span">${roll.at(1)}</span></div>
      `;
    });

    const initialValue = 0;
    const sum = rolls.reduce((sum, el) => sum + el.at(1), initialValue);

    html += `<div class="results__rollContainer--sum"><span>SUM: ${sum}</span></div>`;
    html += `</div>`;

    results.insertAdjacentHTML('afterbegin', html);
    console.log(html);
  }
}

const app = new App();
