const dataUrl = 'data.json';
const dataTable = document.querySelector('#data-table');
const reloadBtn = document.querySelector('#reload-btn');
const downloadBtn = document.querySelector('#download-btn');

let data = []

function loadData() {
  fetch(dataUrl)
    .then(response => response.json())
    .then(newData => {
      data = newData;
      renderTable();
    })
    .catch(error => {
      console.error('Error loading data:', error);
    });
  renderTable();
}

function renderTable() {
  const tbody = dataTable.querySelector('tbody');
  tbody.innerHTML = '';

  data.sort((a, b) => {
    const dateA = new Date(a.date.split('.').reverse().join('-'));
    const dateB = new Date(b.date.split('.').reverse().join('-'));
    return dateB - dateA;
  });

  data.forEach(item => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = item.date;
    row.appendChild(dateCell);

    const resultCell = document.createElement('td');
    resultCell.textContent = item.result;
    row.appendChild(resultCell);

    const versionCell = document.createElement('td');
    versionCell.textContent = item.version;
    row.appendChild(versionCell);

    const allureCell = document.createElement('td');
    const allureLink = document.createElement('a');
    allureLink.setAttribute('href', item.allure);
    allureLink.textContent = item.allure;
    allureCell.appendChild(allureLink);
    row.appendChild(allureCell);

    const runCell = document.createElement('td');
    const runLink = document.createElement('a');
    runLink.setAttribute('href', item.run);
    runLink.textContent = item.run;
    runCell.appendChild(runLink);
    row.appendChild(runCell);

    tbody.appendChild(row);
  });
}

downloadBtn.addEventListener('click', () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
  XLSX.writeFile(workbook, `builds_results_${moment().format('DD_MM_YYYY')}.xlsx`);
});

reloadBtn.addEventListener('click', loadData);

dataTable.querySelector('thead th:nth-child(1)').addEventListener('click', () => {
  data.reverse();
  renderTable();
});

loadData();
