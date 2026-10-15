"use strict";

function makeLocalDate(year, month, day) {
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    return date;
}

function parseBirthDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const date = makeLocalDate(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return null;
    }
    return date;
}

function getAgeInYears(birthDate, today) {
    let years = today.getFullYear() - birthDate.getFullYear();
    const birthdayStillAhead = today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    if (birthdayStillAhead) years -= 1;
    return years;
}

function updateDobLimit(today = new Date()) {
    const year = String(today.getFullYear()).padStart(4, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    document.getElementById("dob").max = `${year}-${month}-${day}`;
}

function resetFeedback() {
    const message = document.getElementById("form-message");
    message.textContent = "";
    message.hidden = true;
    document.getElementById("name").removeAttribute("aria-invalid");
    document.getElementById("dob").removeAttribute("aria-invalid");
    const result = document.getElementById("result");
    result.textContent = "Your age will appear here.";
    result.dataset.state = "empty";
}

function showFormError(text, inputId) {
    const message = document.getElementById("form-message");
    message.textContent = text;
    message.hidden = false;
    const input = document.getElementById(inputId);
    input.setAttribute("aria-invalid", "true");
    input.focus();
}

function calculateAge(today = new Date()) {
    resetFeedback();
    updateDobLimit(today);

    const name = document.getElementById("name").value.trim();
    const dateValue = document.getElementById("dob").value;

    if (!name) {
        showFormError("Please enter your name.", "name");
        return;
    }
    if (!dateValue) {
        showFormError("Please choose your date of birth.", "dob");
        return;
    }

    const birthDate = parseBirthDate(dateValue);
    if (birthDate === null) {
        showFormError("Please enter a valid date of birth.", "dob");
        return;
    }

    const currentDay = makeLocalDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    if (birthDate.getTime() > currentDay.getTime()) {
        showFormError("Date of birth cannot be in the future.", "dob");
        return;
    }

    const age = getAgeInYears(birthDate, currentDay);
    const unit = age === 1 ? "year" : "years";
    const result = document.getElementById("result");
    result.textContent = `${name}, you are ${age} ${unit} old.`;
    result.dataset.state = "ready";
}

document.getElementById("age-form").addEventListener("submit", event => {
    event.preventDefault();
    calculateAge();
});

document.getElementById("name").addEventListener("input", resetFeedback);
document.getElementById("dob").addEventListener("input", resetFeedback);
updateDobLimit();
