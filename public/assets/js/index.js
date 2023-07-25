/**
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
