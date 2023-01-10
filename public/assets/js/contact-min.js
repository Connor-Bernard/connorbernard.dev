import { initializeApp as e } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js"; import { getAnalytics as t } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js"; import { getDatabase as a, set as r, get as o, ref as s, child as n } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"; import "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"; let firebaseConfig = { apiKey: "AIzaSyAatMT5UKjG4NDRbsVU41-g4a24Adnz804", authDomain: "connorbernarddev.firebaseapp.com", databaseURL: "https://connorbernarddev-default-rtdb.firebaseio.com", projectId: "connorbernarddev", storageBucket: "connorbernarddev.appspot.com", messagingSenderId: "838041937464", appId: "1:838041937464:web:3b4190404eac821ae0e8cd", measurementId: "G-X530E89GZZ" }, app = e(firebaseConfig), analytics = t(app), db = a(), contactForm = document.querySelector("#contactSection").querySelector("form"); contactForm.addEventListener("submit", e => { e.preventDefault(); let t = contactForm.querySelector("#formConclusion"), a = t.querySelector("[submissionMessageTemplate]").content.cloneNode(!0).children[0], o = contactForm.querySelector("textArea"), n = contactForm.querySelector("[type=submit]"); t.querySelectorAll(".formResponseMessage").forEach(e => { e.remove() }); let c = {}; contactForm.querySelectorAll("input").forEach(e => { c[e.name] = e.value }), c[o.name] = o.value, r(s(db, `contactForm/${contactForm.querySelector('input[name="firstName"]').value}${contactForm.querySelector('input[name="lastName"]').value}`), c).then(async () => { let e = {}; e.from_name = `${c.firstName} ${c.lastName}`, e.from_phone_number = c.phone, e.message = c.message, e.reply_to = c.email, await emailjs.send("service_lrh52a3", "template_f0xf5bf", e, "xT3P9zK8YmLIxvI3d").then(() => { }, e => { throw Error("Failed to send email - DB updated.") }), a.classList.add("successMessage"), a.querySelector("strong").textContent = "Success", a.querySelector("span").textContent = "Successfully sent your message!", t.appendChild(a) }).catch(e => { console.log(e), a.classList.add("errorMessage"), a.querySelector("strong").textContent = "Error", a.querySelector("span").textContent = "Unable to send message.  Please feel free to reach out to me manually         using the contact cards below.", t.appendChild(a) }), n.disabled = !0, setTimeout(() => { n.disabled = !1 }, 6e4) }), contactForm.querySelectorAll(".notRequired").forEach(e => { e.addEventListener("change", t => { t.target.value ? e.querySelector("label").classList.add("hasInput") : e.querySelector("label").classList.remove("hasInput") }) });