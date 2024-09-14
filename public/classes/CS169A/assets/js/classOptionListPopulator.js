/**
 * Populates the list.
 * @param {string} listName the name of the list being populated.
 * @param {Array<Object>} listData the json decoded list data.
 * @param {function} itemPopulator a function that populates the blank item instance.
 */
function populateList(listName, listData, itemPopulator) {
    const listRef = document.getElementById(`${listName}List`);
    listData.forEach(listItemData => {
        listRef.appendChild(getListItem(listName, listItemData, itemPopulator));
    });
}

/**
 * Gets a new list item instance.
 * @param {string} listName the name of the list being populated.
 * @param {Object} itemData the item's information.
 * @param {function} populate a function that populates the blank item instance.
 * @return {Element} the class list item to be rendered.
 */
function getListItem(listName, itemData, populate=()=>{}) {
    const itemInstance = document.querySelector(`[listItemTemplate].${listName}`)
        .content
        .cloneNode(true)
        .children[0];
    const pillBox = itemInstance.querySelector('.pillBox');
    itemData.tags?.forEach(tag => {
        pillBox.appendChild(getPill(itemInstance, tag));
    });
    if (itemData.title) {
        itemInstance.querySelector('.itemTitle').textContent = itemData.title;
    }
    if (itemData.body) {
        itemInstance.querySelector('.itemBody').textContent = itemData.body;
    }
    if (itemData.ref) {
        itemInstance.classList.add('clickable');
        itemInstance.addEventListener('click', () => {
            window.location = itemData.ref;
        });
    }
    populate(itemInstance, itemData);
    return itemInstance;
}

/**
 * Gets a new pill instance.
 * @param {Element} parent the parent node that defines the pill template.
 * @param {string} pillValue value of the pill.
 * @return {DocumentFragment} the pill to be rendered.
 */
function getPill(parent, pillValue) {
    const pill = parent.querySelector('[PillTemplate]').content.cloneNode(true).children[0];
    pill.textContent = pillValue;
    return pill;
}

/**
 * Updates the size of all list items on the page to maximum size
 * of all list items on the page.
 */
function makeListItemsUniform() {
    const listItems = document.querySelectorAll('.listItemContents');
    let maxItemHeight = 0;
    let maxItemWidth = 0;
    Array.from(listItems).forEach(e => {
        maxItemHeight = Math.max(maxItemHeight, e.offsetHeight);
        maxItemWidth = Math.max(maxItemWidth, e.offsetWidth);
    });
    listItems.forEach(e => {
        e.style.minHeight = `${maxItemHeight}px`;
        e.style.minWidth = `${maxItemWidth}px`;
    });
}

fetch("./assets/json/options.json").then(res => {
    res.json().then(listData => {
        populateList('classOptions', listData);
        makeListItemsUniform();
    });
});
