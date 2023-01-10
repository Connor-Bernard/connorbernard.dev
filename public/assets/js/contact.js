import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, set, get, ref, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";

/**
 * Initializes data for firebase DB
 */
const firebaseConfig = {
    apiKey: "AIzaSyAatMT5UKjG4NDRbsVU41-g4a24Adnz804",
    authDomain: "connorbernarddev.firebaseapp.com",
    databaseURL: "https://connorbernarddev-default-rtdb.firebaseio.com",
    projectId: "connorbernarddev",
    storageBucket: "connorbernarddev.appspot.com",
    messagingSenderId: "838041937464",
    appId: "1:838041937464:web:3b4190404eac821ae0e8cd",
    measurementId: "G-X530E89GZZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

/**
 * Contact Form Handling
 */
const contactForm = document.querySelector("#contactSection").querySelector("form");
contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInjectPoint = contactForm.querySelector("#formConclusion");
    const messageTemplate = messageInjectPoint.querySelector("[submissionMessageTemplate]").content.cloneNode(true).children[0];
    const messageField = contactForm.querySelector("textArea");
    const submitButton = contactForm.querySelector("[type=submit]");
    messageInjectPoint.querySelectorAll(".formResponseMessage").forEach(message => {
        message.remove();
    });
    let submission = {};
    contactForm.querySelectorAll("input").forEach(inputField => {
        submission[inputField.name] = inputField.value;
    });
    submission[messageField.name] = messageField.value;
    // Update firebase database with input data and send email
    set(ref(db, `contactForm/${contactForm.querySelector("input[name=\"firstName\"]").value}${contactForm.querySelector("input[name=\"lastName\"]").value}`), submission).then(async () => {
        let templateParams = {};
        templateParams["from_name"] = `${submission.firstName} ${submission.lastName}`;
        templateParams["from_phone_number"] = submission.phone;
        templateParams["message"] = submission.message;
        templateParams["reply_to"] = submission.email;
        await emailjs.send("service_lrh52a3", "template_f0xf5bf", templateParams, "xT3P9zK8YmLIxvI3d").then(() => {}, (e) => {
            throw new Error("Failed to send email - DB updated.");
        });
        messageTemplate.classList.add("successMessage");
        messageTemplate.querySelector("strong").textContent = "Success";
        messageTemplate.querySelector("span").textContent = "Successfully sent your message!";
        messageInjectPoint.appendChild(messageTemplate);
    // Let the user know if an error occured
    }).catch((e) => {
        console.log(e);
        messageTemplate.classList.add("errorMessage");
        messageTemplate.querySelector("strong").textContent = "Error";
        messageTemplate.querySelector("span").textContent = "Unable to send message.  Please feel free to reach out to me manually \
        using the contact cards below.";
        messageInjectPoint.appendChild(messageTemplate);
    });
    // Rate Limit the form submission to one submission per minute
    submitButton.disabled = true;
    setTimeout(() => {
        submitButton.disabled = false; 
    }, 60000);
});

/**
 * Handle input monitoring and style updates for non-required fields.
 */
contactForm.querySelectorAll(".notRequired").forEach(e => {
    e.addEventListener("change", (event) => {
        if (event.target.value) {
            e.querySelector("label").classList.add("hasInput");
        } else {
            e.querySelector("label").classList.remove("hasInput");
        }
    });
});