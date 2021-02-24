'use strict';

export default class CRMGoodsTable {
  constructor() {
    this.rowId = 0;
    this.currentId = Number();
  }

  init() {
    // objects
    this.createContainer();
    this.createTable();
    this.createModalForm();

    // preload from localstorage
    this.loadFromLocalStorage();

    // events listener
    this.goodEventListener();
    this.createEventListener();
    this.modalFormEventListener();
  }


  // objects
  createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('container');
    document.body.insertAdjacentElement('beforeend', this.container);
  }

  createTable() {
    this.table = document.createElement('div');
    this.table.classList.add('row');
    this.table.innerHTML = `
      <div class="col-md-10 col-md-offset-1">
      <div class="panel panel-default panel-table">
        <div class="panel-heading">
          <div class="row">
            <div class="col col-xs-6">
              <h4 class="panel-title">Редактор списка товаров</h4>
            </div>
            <div class="col col-xs-6 text-right">
              <button type="button" class="btn btn-sm btn-primary btn-create">Добавить</button>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <table class="table table-striped table-bordered table-list">
            <thead>
            <tr>
              <th><em class="fa fa-cog"></em></th>
              <th>Название</th>
              <th>Стоимость</th>
            </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `
    this.container.insertAdjacentElement('beforeend', this.table);
    this.goodsList = document.querySelector('tbody')
    this.buttonCreate = document.querySelector('.btn-create');
  }

  createModalForm() {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="exampleModalLive" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLiveLabel" style="display: none; padding-right: 0px;" aria-modal="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLiveLabel">Редактирование товара</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group-name">
                  <label for="name">Наименование</label>
                  <input type="name" class="form-control" id="name" aria-describedby="name" placeholder="Наиманование товара" required>
                  <small id="name_description" class="form-text text-muted">Вводите полное название товара</small>
                </div>
                <div class="form-group-price">
                  <label for="number">Цена</label>
                  <input type="number" class="form-control" id="price" placeholder="Стоимость товара" required>
                  <small id="number" class="form-text text-muted">Вводите стоимость товара</small>
                </div>
                <button type="submit" class="btn btn-primary btn-save">Сохранить</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `);
    this.modalForm = document.querySelector('.modal');
    this.modalFormCloseButton = this.modalForm.querySelector('.close')
    this.modalFormSubmitButton = this.modalForm.querySelector('.btn-primary')
    this.form = document.forms[0]
    this.goodName = document.getElementById('name');
    this.goodPrice = document.getElementById('price');
  }

  createTableRow(name, price, id, mode) {
    if (id && !mode) {
      document.getElementById(`name_${ this.currentId }`).textContent = name;
      document.getElementById(`price_${ this.currentId }`).textContent = price;
    } else {
      if (!mode) {
        id = this.rowId++;
      }
      this.goodsList.insertAdjacentHTML('beforeend', `
      <tr id="${ id }" class="good">
        <td align="center">
          <a id="${ id }" class="btn btn-default"><em class="fa fa-pencil"></em></a>
          <a id="${ id }" class="btn btn-danger"><em class="fa fa-trash"></em></a>
        </td>
        <td id="name_${ id }">${ name }</td>
        <td id="price_${ id }">${ price }</td>
      </tr>`)
    }
  }

  // popovers
  showPopover(element, message) {
    const labelName = element.querySelector('label')
    const modalBody = document.querySelector('.modal-body')

    element.insertAdjacentHTML('beforeend', `
      <div 
        class="popover show fade bs-popover-right" 
        role="tooltip" id="popover913754" 
        x-placement="right" 
        style=" position: absolute; 
                top: ${ labelName.offsetHeight 
                        + Number(window.getComputedStyle(labelName).marginBottom.replace('px', '')) }px; 
                left: ${  modalBody.offsetWidth 
                          - Number(window.getComputedStyle(modalBody).paddingRight.replace('px', '')) }px; 
                will-change: transform;">
        <div class="arrow" style="top: 5px;"></div>
        <h3 class="popover-header"></h3>
        <div class="popover-body">${message}</div>
      </div>
    `)
  }

  removeAllPopovers() {
    let popoverList = document.querySelectorAll('.popover');
    if (popoverList) { popoverList.forEach(e => { e.remove() })
    }
  }


  // events
  goodEventListener() {
    this.goodsList.addEventListener('click', (e) => {

      function getLink() {
        if ((e.target).parentNode.tagName === 'svg') {
          return (e.target).parentNode.parentNode;
        } else if ((e.target).tagName === 'A') {
          return e.target;
        } else {
          return (e.target).parentNode;
        }
      }

      let link = getLink();

      if (link.classList.contains('btn-default')) {
        this.modalFormToggle('show');
        this.goodName.value = link.parentNode.nextElementSibling.textContent;
        this.goodPrice.value = link.parentNode.nextElementSibling.nextElementSibling.textContent;
        this.currentId = link.id;
      } else if (link.classList.contains('btn-danger')) {
        document.querySelector(`tr[id="${link.id}"]`).remove();
        this.saveToLocalStorage();
      }
    })
  }

  createEventListener() {
    this.buttonCreate.addEventListener('click', (e) => {
      this.currentId = Number();
      this.modalFormToggle('show');
    })
  }

  modalFormEventListener() {
    this.modalFormCloseButton.addEventListener('click', (e) => {
      this.currentId = Number();
      this.modalFormToggle('close');
    })

    this.modalFormSubmitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAllPopovers();
      const first=[...this.form].find(o=>!o.validity.valid);
      if (first) {
        first.focus();
        if (first.parentNode.classList.contains('form-group-name')) {
          this.showPopover(document.querySelector('.form-group-name'), 'Укажите наименование товара');
        } else if (first.parentNode.classList.contains('form-group-price')) {
          this.showPopover(document.querySelector('.form-group-price'), 'Укажите стоимость товара');
        }
      } else {
        this.createTableRow(this.goodName.value, this.goodPrice.value, this.currentId, false);
        this.modalFormToggle('close');
        this.goodName.value = '';
        this.goodPrice.value = '';
        this.saveToLocalStorage();
      }
    })
  }

  modalFormToggle(type) {
    if (type === 'show') {
      this.modalForm.classList.add('show');
      this.modalForm.style.display = 'block';
    } else if (type === 'close') {
      this.modalForm.classList.remove('show');
      this.modalForm.style.display = 'none';
      this.goodName.value = '';
      this.goodPrice.value = '';
    }
  }

  // localstorage
  saveToLocalStorage() {

    this.goods = [];
    [...document.querySelectorAll('tbody')[0].children].forEach(e => {
      this.goods.push({
        'id': e.id,
        'name': e.querySelector(`td[id="name_${e.id}"]`).textContent,
        'price': e.querySelector(`td[id="price_${e.id}"]`).textContent,
      })
    })
    localStorage.setItem('goods', JSON.stringify(this.goods));
  }

  loadFromLocalStorage() {
    try {
      const goods = JSON.parse(localStorage.getItem('goods'));
      if ( goods !== null) {
        for (let good of goods) {
          this.createTableRow(good.name, good.price, good.id, true)
        }
      }
    } catch(e) {
    }
  }

}

