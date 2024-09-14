/**
 * Populates the class list.
 * @param {Array<Object>} classListData the json decoded class list data.
 */
function populateClassList(classListData) {
    const classList = document.getElementById('classList');
    classListData.forEach(classData => {
        classList.appendChild(getClassListItem(classData));
    });
}

/**
 * Gets a new class item instance.
 * @param {Object} classInfo the class information.
 * @return {DocumentFragment} the class list item to be rendered.
 */
function getClassListItem(classInfo) {
    const classItem = document.querySelector('[listItemTemplate].classes')
        .content
        .cloneNode(true)
        .children[0];
    classItem.querySelector('.itemTitle').textContent = classInfo.name;
    classItem.querySelector('.itemBody').textContent = `${classInfo.class}: ${classInfo.description}`;
    const pillBox = classItem.querySelector('.pillBox');
    classInfo.tags.forEach(tag => {
        pillBox.appendChild(getPill(classItem, tag));
    });
    classItem.addEventListener('click', () => {
        window.location = `./${classInfo.name}`;
    })
    return classItem;
}

/**
 * Gets a new pill instance.
 * @param {DocumentFragment} parent the parent node that defines the pill template.
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

fetch("./assets/json/classes.json").then(res => {
    res.json().then(classListData => {
        populateClassList(classListData);
        makeListItemsUniform();
    });
});
