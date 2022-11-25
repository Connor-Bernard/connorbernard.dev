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

fetch("/assets/json/portfolio.json").then(response => {
    response.json().then(portfolioData => {
        populatePortfolio(portfolioData);
    });
});