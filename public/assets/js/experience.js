/**
 * Populates the content in the experience blocks using the HTML template
 * @param {JSON Array} experienceData 
 */
function populateExperienceField(experienceData){
    const experienceInjectPoint = document.querySelector("#experienceBoxes");
    const experienceTemplate = experienceInjectPoint.querySelector("[experienceBoxTemplate]");
    const subItemTemplate = experienceTemplate.content.querySelector("[experienceSubItemTemplate]");
    experienceData.forEach(experience => {
        const currExperienceTemplate = experienceTemplate.content.cloneNode(true).children[0];
        const subItemInjectPoint = currExperienceTemplate.querySelector("ul");
        const companyImage = currExperienceTemplate.querySelector("img");
        companyImage.src = experience["companyImageLink"];
        companyImage.alt = `${experience.company} logo`;
        currExperienceTemplate.querySelector("h3").textContent = experience["position"];
        experience["content"].forEach(subItem => {
            const currSubItemTemplate = subItemTemplate.content.cloneNode(true).children[0];
            currSubItemTemplate.querySelectorAll("strong")[0].textContent = `${subItem["subtitle"]}`;
            if (window.innerWidth > 470) {
                const location = subItem["location"];
                const locationField = currSubItemTemplate.querySelectorAll("strong")[1];
                if(location){
                    locationField.textContent = ` @ ${location}`;
                } else {
                    locationField.style.display = "none";
                }
                currSubItemTemplate.querySelector("span").textContent = `: ${subItem["description"]}`;
            }
            subItemInjectPoint.appendChild(currSubItemTemplate);
        });
        experienceInjectPoint.appendChild(currExperienceTemplate);
        // experienceInjectPoint.querySelectorAll(".experienceBox").forEach(experienceBox => {
        //     const img = experienceBox.querySelector("img");
        //     img.onload = () => {
        //         const currHeight = parseFloat(window.getComputedStyle(experienceBox).height);
        //         experienceBox.style.height = `${currHeight + img.height}px`;
        //         updateExperienceHeights();
        //     }
        // });
    });
}

/**
 * Updates the copy of the experience elements depending on screen width.
 */
function updateCopy(){
    if(window.innerWidth < 425){
        document.querySelectorAll(".experienceCopy").forEach(copySection => {
            copySection.style.display = "none";
        });
    } else {
        document.querySelectorAll(".experienceCopy").forEach(copySection => {
            copySection.style.display = "inline";
        });
    }
}
/**
 * Updates the heights of the experience blocks to allow use of gradient border
 * needs to be called AFTER company images load (present issue)
 * Can be done by implementing eager loading on headers, but ideally not implemented that way;
 */
// function updateExperienceHeights(){
//     let currLargestBlock = 0;
//     document.querySelectorAll(".experienceBox").forEach(experienceBlock => {
//         currLargestBlock = Math.max(currLargestBlock, parseFloat(window.getComputedStyle(experienceBlock).height));
//     });
//     document.querySelectorAll(".experienceBox").forEach(experienceBlock => {
//         experienceBlock.style.height = `${currLargestBlock}px`;
//     });
// }

fetch("/assets/json/experiences.json").then(response => {
    response.json().then(data => {
        populateExperienceField(data);
    });
});

addEventListener("resize", () => {
    updateCopy();
});