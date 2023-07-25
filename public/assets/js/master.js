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
            const locationField = currSubItemTemplate.querySelectorAll("strong")[1];
            const location = subItem["location"];
            if (location) {
                locationField.textContent = ` @ ${location}`;
            } else {
                locationField.style.display = "none";
            }
            currSubItemTemplate.querySelectorAll("strong")[0].textContent = `${subItem["subtitle"]}`;
            currSubItemTemplate.querySelector("span").textContent = `: ${subItem["description"]}`;
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
    updateCopy();
}

/**
 * Updates the copy of the experience elements depending on screen width.
 */
function updateCopy(){
    if(window.innerWidth < 470){
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
});/**
 * Populates the Portfolio items with content.
 * @param {JSON Array} portfolioData 
 */
function populatePortfolio(portfolioData){
    const portfolioItemInjectPoint = document.querySelector("#portfolioItems");
    const portfolioItemTemplate = portfolioItemInjectPoint.querySelector("[portfolioItemTemplate]");
    const languageBoxTemplate = portfolioItemTemplate.content.querySelector("[languageBoxTemplate]");
    portfolioData.forEach(portfolioElement => {
        const currPortfolioItemTemplate = portfolioItemTemplate.content.cloneNode(true).children[0];
        currPortfolioItemTemplate.querySelector("h3").textContent = portfolioElement.title;
        currPortfolioItemTemplate.querySelector("p").textContent = portfolioElement.description;
        const languageInjectPoint = currPortfolioItemTemplate.querySelector(".languages");
        portfolioElement.languages.forEach(language => {
            const currLanguageTemplate = languageBoxTemplate.content.cloneNode(true).children[0];
            currLanguageTemplate.textContent = language;
            languageInjectPoint.appendChild(currLanguageTemplate);
        });
        portfolioItemInjectPoint.appendChild(currPortfolioItemTemplate);
    });
}

/**
 * Updates the size of the elements in the portfolio section.
 */
function updateSize(){
    let maxItemHeight = 0;
    const portfolioItems = document.querySelectorAll('.portfolioItem');
    const firstItemStyle = getComputedStyle(portfolioItems[0]);
    getItemWidth = () => {return firstItemStyle.width}
    const paddingOffset = parseFloat(firstItemStyle.padding) * 2;
    portfolioItems.forEach(item => {
        maxItemHeight = Math.max(maxItemHeight, item.clientHeight);
    });

    maxItemHeight -= paddingOffset;

    portfolioItems.forEach(item => {
        item.style.height = `${maxItemHeight}px`;
    });
}

/**
 * Sleeps for a certain period of time.
 * @param {int} ms how many ms to sleep for.
 * @returns {Promise<Function>} sleep event.
*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Adds the event listeners to enforce these constraints.

window.addEventListener('resize', (event) => {
    const widthPx = parseFloat(event.target.innerWidth);
    if(widthPx >= 1000){
        updateSize();
    }
});

window.addEventListener('load', async () => {
    for(i = 0; i < 16; i++){
        try {
            if(parseFloat(window.innerWidth) >= 1000){
                updateSize();
            }
            break;
        } catch(err){
            await sleep(10);
        }
    }
});

// Requests data and populates portfolio.

fetch("/assets/json/portfolio.json").then(response => {
    response.json().then(portfolioData => {
        populatePortfolio(portfolioData);
    });
});/**
 * Toggles the provided hamburger.
 * @param {HTML Element} hamburger
 * @param {HTML Element} navMenu
 */
function toggleHamburger(hamburger, navMenu){
    const active = hamburger.classList.contains("active");
    if(active){
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    } else {
        hamburger.classList.add("active");
        navMenu.classList.add("active");
    }
}

/**
 * Handles the loading of blur elements.  Prevents from loading outside of
 * expected loading regions.
 */
// function blurHandler(){
//     const footerBoundingRect = document.querySelector("header").getBoundingClientRect();
//     document.querySelectorAll(".blur").forEach(blurElement => {
//         const boundingRect = blurElement.getBoundingClientRect();
//         while(Math.abs(boundingRect.y) + boundingRect.height < Math.abs(footerBoundingRect.y) + footerBoundingRect.height) {
//             console.log(Math.abs(boundingRect.y) + boundingRect.height);
//             boundingRect.y -= boundingRect.height;
//         }
//     })
// }

/**
 * Initializes the hamburger with all necessary events and listeners.
 */
function __initHamburger__(){
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav");
    hamburger.onclick = () => {
        toggleHamburger(hamburger, navMenu);
    }
    addEventListener("resize", event => {
        if (event.target.innerWidth > 1024 && hamburger.classList.contains("active")) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
    addEventListener("scroll", () => {
        if(window.pageYOffset >= 330){
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
}

// document.querySelectorAll(".blur").forEach(blurElement => {
//     addEventListener("load", () => {
//         blurHandler();
//     });
// });
__initHamburger__();

addEventListener("load", () => {
    document.querySelector("#loaderPage").style.display = "none";
    document.querySelector("header").style.position = "fixed";
});
