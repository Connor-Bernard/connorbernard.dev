function updateNavMenuActive(a=null){
    document.querySelectorAll(".navItem > a").forEach(element => {
        element.classList.remove("active");
    });
    if(a){
        a.classList.add("active");
    }
}

document.querySelector("nav").querySelectorAll(".navItem > a").forEach((a) => {
    const wpLocationDown = document.querySelector(`#${a.innerText.replace(/\s/g, '')}`);
    const wpLocationUp = document.querySelector(`#${a.innerText.replace(/\s/g, '')}Up`);
    if(wpLocationDown){
        new Waypoint({
            element: wpLocationDown,
            handler: (direction) => {
                if(direction == "down"){
                    updateNavMenuActive(a);
                }
            },
            offset:"30%"
        });
    }
    if(wpLocationUp){
        new Waypoint({
            element: wpLocationUp,
            handler: (direction) => {
                if (direction == "up") {
                    updateNavMenuActive(a);
                }
            }
        });
    }
});
new Waypoint({
    element:document.querySelector("#helloUp"),
    handler: (direction) => {
        if(direction == "up"){
            updateNavMenuActive();
        }
    }
});