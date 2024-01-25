const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearItems = document.getElementById('clear');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = document.getElementById('frmBtn');
let editMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUi();
}
    
function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    if (newItem == '') {
        alert('Please Add an Item');
        return;
    }
    if (editMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
    
        removeItemFromStorage(itemList.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        editMode = false;
    } else {
        if (checkItemExist(newItem)) {
            alert('That Item is Already Exist!');
            return;
        }
    }
    //Add New Item to DOM
    addItemToDOM(newItem);
    // Add item to local storage
    addItemToStorage(newItem);
    checkUi();
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);   
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();
    
    //Add to Storage
    itemsFromStorage.push(item);

    //Covert to JSon string
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}

function removeItem(item) {
    if(confirm('Are you sure to delete ?')){
        item.remove();
    }
    removeItemFromStorage(item.textContent);
    checkUi();
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearAllItem(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
        
    };
    localStorage.removeItem('items');
    checkUi();
}

function setItemToEdit(item) {
    editMode = true;
    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class= "fa-solid fa-pen "></i> Update Item';
    formBtn.style.backgroundColor = '#32cd32';
    itemInput.value = item.textContent;
}

function filterItem(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    });
}

function checkItemExist(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

function checkUi() {
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
}
    
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearItems.addEventListener('click', clearAllItem);
    itemFilter.addEventListener('input', filterItem);
    document.addEventListener('DOMContentLoaded', displayItems);
    
    checkUi();    
}
init();

