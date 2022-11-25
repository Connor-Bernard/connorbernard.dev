/**
 * Updates the amount of icons shown to the user based on screen size
 */
function updateIcons(){
    const windowSize = window.innerWidth;
    document.querySelectorAll(".iconSection").forEach(section => {
        section.querySelectorAll(".icon").forEach((icon, i) => {
            if(windowSize < 600 && i >= 6){
                icon.style.display = "none";
            } else if(windowSize > 600){
                icon.style.display = "flex";
            }
        });
    });
}
/**
 * Populates the language Field of About Me
 * @param {JSON Object Array} iconData 
 */
function populateLanguageField(iconData){
    const template = document.querySelector("[iconTemplate]");
    let insertLocation = null;
    iconData.forEach((element, i) => {
        if(!insertLocation){
            insertLocation = document.querySelector(`[${element["type"]}]`);
        }
        const currIconTemplate = template.content.cloneNode(true).children[0];
        currIconTemplate.querySelector("p").textContent = element.name;
        currIconTemplate.querySelector("img").src = element.link;
        currIconTemplate.querySelector("img").alt = `${element.name} Icon`;
        insertLocation.appendChild(currIconTemplate);
    });
    updateIcons();
}

fetch("/assets/json/languages.json").then(response => {
    response.json().then(data => {
        populateLanguageField(data);
    });
});

fetch("/assets/json/utilities.json").then(response => {
    response.json().then(data => {
        populateLanguageField(data);
    });
});

addEventListener("resize", (event) => {
    updateIcons();
});