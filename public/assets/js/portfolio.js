/**
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
});