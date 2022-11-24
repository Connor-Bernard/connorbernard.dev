const sent = (new URLSearchParams(window.location.search)).get("submitted");
const messageInjectPoint = document.querySelector("#formConclusion");
const messageTemplate = messageInjectPoint.querySelector("[submissionMessageTemplate]").content.cloneNode(true).children[0];
if(sent == "true"){
    messageTemplate.classList = ["successMessage"];
    messageTemplate.querySelector("strong").textContent = "Success";
    messageTemplate.querySelector("span").textContent = ": Successfully sent your message!";
    messageInjectPoint.appendChild(messageTemplate);
} else if(sent == "false"){
    messageTemplate.classList = ["errorMessage"];
    messageTemplate.querySelector("strong").textContent = "Error";
    messageTemplate.querySelector("span").textContent = ": Unable to send message.";
    messageInjectPoint.appendChild(messageTemplate);
}