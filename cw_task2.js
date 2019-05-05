/*

  Данные: http://www.json-generator.com/api/json/get/ceRHciXcVu?indent=2
  Задача.

  1.  Получить данные и в виде простой таблички вывести список компаний. Для начала используем поля:
      Company | Balance | Registered | Показать адресс | Кол-во employers | показать сотрудников

  2.  Сделать сортировку таблицы по количеству сотрудников и балансу. Сортировка должна происходить по клику
      на заголовок столбца

  3.  По клику на показать адресс должна собиратся строка из полей адресса и показываться на экран.

  4.  По клику на показать сотрудников должна показываться другая табличка формата:
      <- Назад к списку компаний | *Название компании*
      input
      Сотрудники:
      Name | Gender | Age | Contacts

  5.  В второй табличке долен быть реализован поиск сотрудников по их имени, а так же сортировка по
      полу и возрасту.

  Примечание: Весь код должен писатся с учетом синтаксиса и возмжность ES6.

*/


let url = 'http://www.json-generator.com/api/json/get/ceRHciXcVu?indent=2';

let myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

const ConvertToJSON = (data) => data.json();

fetch (url, {method: 'POST', header: myHeaders})
  .then(ConvertToJSON)
  .then( data => {
    render();
    let x =  data.map(( item ) => {
      new StringTR (item._id,item.company,item.balance,item.registered,item.address,item.employers.lenght,item.employers).renderStringTable();
    });
  })

const table = [];
let emplTable = [];

class StringTR{
  constructor (id, company, balance, registered, adress, quantityEmployers, employers,){
    this.id = id;
    this.company = company;
    this.balance = balance;
    this.registered = registered;
    this.adress = adress;
    this.quantityEmployers = quantityEmployers;
    this.employers = employers;

    this.showAdress = this.showAdress.bind(this);
    this.showEmployers = this.showEmployers.bind(this);
    this.renderStringTable = this.renderStringTable.bind(this);
    this.renderStringTableEm = this.renderStringTableEm.bind(this);

    table.push(this);
  };

  showAdress(e){
    let fulAdress = '';
    for (let key in this.adress){
      fulAdress += `${this.adress[key]} `;
    }
    console.log (fulAdress);
    let parent = e.target;
    parent.innerHTML = fulAdress;
  };

  showEmployers(){
    while (emplTable[0]) {
      emplTable.pop();
    };
    emplTable.push(this.employers);
    emplTable = this.employers;
    this.renderStringTableEm();
  };

  renderStringTable(){
    let tbody = document.getElementById('tableBase').querySelectorAll('tbody')[0];
    let node = document.createElement('tr');
    node.innerHTML = `
      <td>${this.company}</td>
      <td>${this.balance}</td>
      <td>${this.registered}</td>
      <td class="adress" style="cursor: pointer" onmouseover="this.style.background = 'silver'" onmouseout="this.style.background = ''">show adress</td>
      <td>${this.employers.length}</td>
      <td class="employers" style="cursor: pointer" onmouseover="this.style.background = 'silver'" onmouseout="this.style.background = ''">show employers</td>
    `;
    tbody.appendChild( node );
    let btnAdre = node.querySelector('.adress');
    btnAdre.onclick = this.showAdress;
    let btnEmpl = node.querySelector('.employers');
    btnEmpl.onclick = this.showEmployers; 
  };

  renderStringTableEm(){
    let tbody = document.getElementById('tableBase').querySelectorAll('tbody')[0];
    while (tbody.firstChild){
      tbody.removeChild(tbody.firstChild);
    }
    for (let key in this.employers){
      let node = document.createElement('tr');
      node.innerHTML = `
        <td>${this.employers[key].name}</td>
        <td>${this.employers[key].age}</td>
        <td>${this.employers[key].gender}</td>
        <td>${this.employers[key].phones.join('<br/>')}</td>   
      `;
      tbody.appendChild( node ); 
    };
    renderEmp (this.company);
  };

};

function render (){
  let thead = document.getElementById('tableBase').querySelector('thead');
  let node = document.createElement('tr');
  node.innerHTML = `
    <th>Company</th>
    <th data-type="string" onclick="sortTable(event)" style="cursor: pointer" onmouseover="this.style.background = 'yellow'" onmouseout="this.style.background = ''">Balance</th>
    <th>Registered</th>
    <th>Show address</th>
    <th data-type="number" onclick="sortTable(event)" style="cursor: pointer" onmouseover="this.style.background = 'yellow'" onmouseout="this.style.background = ''">Number of employees</th>
    <th>Show employees</th>
  `;
  thead.appendChild( node );    
};

function renderEmp (company){
  let thead = document.getElementById('tableBase').querySelector('thead');
  while (thead.firstChild){
      thead.removeChild(thead.firstChild);
    }
  let node = document.createElement('tr');
  node.innerHTML = `
    <th>Name</th>
    <th data-type="number" onclick="sortTable(event)" style="cursor: pointer" onmouseover="this.style.background = 'yellow'" onmouseout="this.style.background = ''">Age</th>
    <th data-type="string" onclick="sortTable(event)" style="cursor: pointer" onmouseover="this.style.background = 'yellow'" onmouseout="this.style.background = ''">Gender</th>
    <th>Contacts</th>
  `;
  thead.appendChild( node );
  let menuTable = document.getElementById('blockSecondTable');
  let node2 = document.createElement('tr');
  node2.innerHTML = `
    <span onclick="location.reload(true)" style="cursor: pointer"><< Назад к списку компаний</span>
    <span>| *${company}*</span><br><br>
    <input type="text" name="find" id="inputFind" value="">
    <button onclick="findTable()">Find</button><br><br>
  `;
  menuTable.appendChild( node2 ); 
};

function sortTable(e) {
  let tbody = document.getElementById('tableBase').querySelectorAll('tbody')[0];
  let rowsArray = [].slice.call(tbody.rows);
  switch(e.target.getAttribute('data-type')){
    case 'number':
      rowsArray.sort((a,b)=>a.cells[e.target.cellIndex].innerHTML-b.cells[e.target.cellIndex].innerHTML);
      break;
    case 'string':
      rowsArray.sort((a,b)=>{
        if (a.cells[e.target.cellIndex].innerHTML>b.cells[e.target.cellIndex].innerHTML) {
          return 1
        } else {return -1}
      });
      break;
  }
  while (tbody.firstChild){
    tbody.removeChild(tbody.firstChild);
  };
  for (var i = 0; i < rowsArray.length; i++) {
    tbody.appendChild(rowsArray[i]);
  };
  console.log(e);
}

function findTable() {
  let tbody = document.getElementById('tableBase').querySelectorAll('tbody')[0];
  let item =  document.getElementById('inputFind').value;

  let rowsArray = [].slice.call(tbody.rows);
  // console.log(rowsArray[0].cells[0].innerHTML.toLowerCase().indexOf(item.toLowerCase())>-1)
  let result = rowsArray.filter((el)=>el.cells[0].innerHTML.toLowerCase().indexOf(item.toLowerCase())>-1);
  while (tbody.firstChild){
    tbody.removeChild(tbody.firstChild);
  };
  for (var i = 0; i < result.length; i++) {
    tbody.appendChild(result[i]);
  };
}
