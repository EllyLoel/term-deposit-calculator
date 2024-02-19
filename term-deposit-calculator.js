const form = document.querySelector("form");
const finalBalanceElement = document.querySelector("#final-balance");
const principalInputElement = document.querySelector("#principal");
const interestRateInputElement = document.querySelector("#interest-rate");
const termYearsInputElement = document.querySelector("#term-years");
const termMonthsInputElement = document.querySelector("#term-months");
const interestPaymentFrequencyInputElement = document.querySelector("#interest-payment-frequency-radiogroup");
const principalErrorElement = document.querySelector("#principal-error");
const interestRateErrorElement = document.querySelector("#interest-rate-error");
const termErrorElement = document.querySelector("#term-error");
const interestPaymentFrequencyErrorElement = document.querySelector("#interest-payment-frequency-error");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);

    let principal = formData.get("principal").replaceAll(",", "").replaceAll(" ", "");
    let interestRate = formData.get("interest-rate").replaceAll(" ", "");
    let termYears = formData.get("term-years").replaceAll(" ", "");
    let termMonths = formData.get("term-months").replaceAll(" ", "");
    const interestPaymentFrequency = formData.get("interest-payment-frequency");

    // Error handling

    const isError = {
        principal: false,
        interestRate: false,
        termYears: false,
        termMonths: false,
        interestPaymentFrequency: false,
    };

    const addErrorState = (id, errorElement, inputElement) => {
        isError[id] = true;
        if (errorElement) errorElement.style.display = "block";
        inputElement.setAttribute("aria-invalid", "true");
    }

    const removeErrorState = (id, errorElement, inputElement) => {
        isError[id] = false;
        if (errorElement) errorElement.style.display = "none";
        inputElement.removeAttribute("aria-invalid");
    }
    
    if (!principal || isNaN(principal)) {
        addErrorState("principal", principalErrorElement, principalInputElement);
    } else {
        removeErrorState("principal", principalErrorElement, principalInputElement);
    }

    if (!interestRate || isNaN(interestRate)) {
        addErrorState("interestRate", interestRateErrorElement, interestRateInputElement);
    } else {
        removeErrorState("interestRate", interestRateErrorElement, interestRateInputElement);
    }
    
    if (!termYears || isNaN(termYears)) {
        addErrorState("termYears", null, termYearsInputElement);
    } else {
        removeErrorState("termYears", null, termYearsInputElement);
    }
    if (!termMonths || isNaN(termMonths)) {
        addErrorState("termMonths", null, termMonthsInputElement);
    } else {
        removeErrorState("termMonths", null, termMonthsInputElement);
    }
    // termYears and termMonths share an error message so we have to manage showing and hiding that seperately
    if (!termYears || isNaN(termYears) || !termMonths || isNaN(termMonths)) {
        termErrorElement.style.display = "block";
    } else {
        termErrorElement.style.display = "none";
    }
    
    if (!interestPaymentFrequency || (interestPaymentFrequency !== "monthly" && interestPaymentFrequency !== "quarterly" && interestPaymentFrequency !== "annually" && interestPaymentFrequency !== "at-maturity")) {
        addErrorState("interestPaymentFrequency", interestPaymentFrequencyErrorElement, interestPaymentFrequencyInputElement);
    } else {
        removeErrorState("interestPaymentFrequency", interestPaymentFrequencyErrorElement, interestPaymentFrequencyInputElement);
    }

    // Calculations
    
    if (!isError.principal && !isError.interestRate && !isError.termYears && !isError.termMonths && !isError.interestPaymentFrequency) {
        principal = parseFloat(formData.get("principal").replaceAll(",", "").replaceAll(" ", ""));
        interestRate = parseFloat(formData.get("interest-rate")) / 100;
        termYears = parseFloat(formData.get("term-years")) || 0;
        termMonths = parseFloat(formData.get("term-months")) || 0;
        const term = termYears + (termMonths / 12);
    
        let localisedFinalBalance;
    
        if (interestPaymentFrequency === "at-maturity") {
            const finalBalance = principal * (1 + interestRate * term)
    
            localisedFinalBalance = finalBalance.toLocaleString(undefined, { style: "currency", currency: "AUD" });
        } else {
            let numberOfTimesCompounded;
    
            switch (interestPaymentFrequency) {
                case "monthly":
                    numberOfTimesCompounded = 12;
                    break;
                case "quarterly":
                    numberOfTimesCompounded = 4;
                    break;
                case "annually":
                    numberOfTimesCompounded = 1;
                    break;
            }
    
            const finalBalance = principal * (1 + interestRate / numberOfTimesCompounded) ** (numberOfTimesCompounded * term)
    
            localisedFinalBalance = finalBalance.toLocaleString(undefined, { style: "currency", currency: "AUD" });
        }
    
        finalBalanceElement.textContent = localisedFinalBalance;
    }
});
