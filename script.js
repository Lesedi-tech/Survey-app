function showScreen(screen) {
  document.getElementById('form-section').style.display = screen === 'form' ? 'block' : 'none';
  document.getElementById('results-section').style.display = screen === 'results' ? 'block' : 'none';
  if (screen === 'results') displayResults();
}

document.getElementById('survey-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const dob = document.getElementById('dob').value;
  const phone = document.getElementById('phone').value.trim();
  const foods = Array.from(document.querySelectorAll('input[name="food"]:checked')).map(cb => cb.value);

  const ratings = ['movies', 'radio', 'eatOut', 'tv'].map(id => document.querySelector(`input[name="${id}"]:checked`));

  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (!name || !email || !dob || !phone || isNaN(age) || age < 5 || age > 120 || ratings.some(r => r === null)) {
    alert("Please complete all fields correctly.");
    return;
  }

  const survey = {
    name,
    age,
    dob,
    email,
    phone,
    foods,
    movies: parseInt(ratings[0].value),
    radio: parseInt(ratings[1].value),
    eatOut: parseInt(ratings[2].value),
    tv: parseInt(ratings[3].value)
  };

  const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
  surveys.push(survey);
  localStorage.setItem('surveys', JSON.stringify(surveys));
  alert("Survey submitted!");
  this.reset();
});

function displayResults() {
  const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
  const resultBody = document.getElementById('results');
  resultBody.innerHTML = '';

  if (surveys.length === 0) {
    resultBody.innerHTML = '<tr><td colspan="2">No Surveys Available.</td></tr>';
    return;
  }

  const total = surveys.length;
  const ages = surveys.map(s => s.age);
  const avgAge = (ages.reduce((a, b) => a + b, 0) / total).toFixed(1);
  const oldest = Math.max(...ages);
  const youngest = Math.min(...ages);

  const countByFood = food => surveys.filter(s => s.foods.includes(food)).length;
  const pct = count => ((count / total) * 100).toFixed(1);

  const avg = key => (surveys.map(s => s[key]).reduce((a, b) => a + b, 0) / total).toFixed(1);

  const data = [
    ['Total number of surveys:', total],
    ['Average Age:', avgAge],
    ['Oldest person who participated in survey:', oldest],
    ['Youngest person who participated in survey:', youngest],
    ['Percentage of people who like Pizza:', `${pct(countByFood('Pizza'))}%`],
    ['Percentage of people who like Pasta:', `${pct(countByFood('Pasta'))}%`],
    ['Percentage of people who like Pap and Wors:', `${pct(countByFood('Pap and Wors'))}%`],
    ['People who like to watch movies:', avg('movies')],
    ['People who like to listen to radio:', avg('radio')],
    ['People who like to eat out:', avg('eatOut')],
    ['People who like to watch TV:', avg('tv')]
  ];

  data.forEach(([label, value]) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td class="label-col">${label}</td><td class="value-col">${value}</td>`;
    resultBody.appendChild(row);
  });
}

function resetSurveyData() {
  if (confirm("Are you sure you want to reset?")) {
    localStorage.removeItem('surveys');
    alert("The Survey has been Reset.");
    displayResults();
  }
}
