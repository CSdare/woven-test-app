import Woven from 'woven-js/client';
import wovenWorker from 'worker-loader?inline=true&name=woven-worker.js!babel-loader!woven-Loader!./woven_functions/functions.js';

const woven = new Woven();
woven.connect(wovenWorker);

window.onload = function() {

  // Add 10 functionality
  const add10Button = document.getElementById('add-10-btn');
  const numbers = Array.from(document.getElementsByClassName('number'));
  add10Button.onclick = function() {
    numbers.forEach(node => {
      let num = Number(node.innerHTML);
      woven.run('addTen', num)  
        .then(newNum => node.innerHTML = newNum);
    });
  }


  // Fib functionality
  function wovenCalcFib(num) {
    woven.run('nthFib', num)
      .then((fib) => {
        const li = document.createElement('li');
        li.textContent = num + ' = ' + fib;
        wovenFibList.appendChild(li);
      });
  }

  function browserCalcFib(num) {
    function nthFib(num) {
      if (num === 0) return 0;
      if (num === 1) return 1;
      return nthFib(num - 1) + nthFib(num - 2);
    }
    const fibNumber = nthFib(num);
    const li = document.createElement('li');
    li.textContent = num + ' = ' + fibNumber;
    browserFibList.appendChild(li);
  }

  const wovenFibList = document.getElementById('woven-fib-list');
  const wovenFibNumber = document.getElementById('woven-fib-number');
  const wovenFibButton = document.getElementById('woven-calc-fib');

  const browserFibList = document.getElementById('browser-fib-list');
  const browserFibNumber = document.getElementById('browser-fib-number');
  const browserFibButton = document.getElementById('browser-calc-fib');

  wovenFibButton.addEventListener('click', () => wovenCalcFib(wovenFibNumber.value || 8));
  browserFibButton.addEventListener('click', () => browserCalcFib(browserFibNumber.value || 8));


  // Color box functionality
  function getColor(e) {
    woven.run('generateRandomColor')
      .then(color => {
        e.target.style.backgroundColor = `rgb(${color.red},${color.green},${color.blue})`;
      });
  }

  const colorBoxes = Array.from(document.getElementsByClassName('color-box'));
  colorBoxes.forEach(colorBox => colorBox.addEventListener('click', getColor));
}
