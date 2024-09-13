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

fetch("./assets/json/classes.json").then(res => {
    res.json().then(classListData => {
        populateClassList(classListData);
    });
});
