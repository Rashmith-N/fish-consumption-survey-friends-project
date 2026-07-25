const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwAC---mvU0xd6JQADMWkz4sELysM0Yt_q086yEyPWPh9WyjZF_OIUe_FekmRjP960T/exec";

const form = document.getElementById("surveyForm");
const otherCheck = document.getElementById("otherFishCheck");
const otherBox = document.getElementById("otherFishBox");
const otherFish = document.getElementById("otherFish");
const fishError = document.getElementById("fishError");
const submitBtn = document.getElementById("submitBtn");
const status = document.getElementById("status");
const successMessage = document.getElementById("successMessage");
const anotherBtn = document.getElementById("anotherBtn");

function updateOtherField() {
  const selected = otherCheck.checked;

  otherBox.classList.toggle("hidden", !selected);
  otherFish.required = selected;

  if (!selected) {
    otherFish.value = "";
  }
}

function selectedFish() {
  return [...document.querySelectorAll('input[name="fish"]:checked')]
    .map(input => input.value);
}

otherCheck.addEventListener("change", updateOtherField);

document.querySelectorAll('input[name="fish"]').forEach(input => {
  input.addEventListener("change", () => {
    fishError.textContent = selectedFish().length
      ? ""
      : "Please select at least one fish.";
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  status.textContent = "";
  status.className = "status";
  fishError.textContent = "";

  const fish = selectedFish();

  if (fish.length === 0) {
    fishError.textContent = "Please select at least one fish.";

    document.querySelector(".fish-grid").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    status.textContent =
      "The website is ready, but the Google Sheets Web App URL has not been added yet.";

    status.className = "status error";

    return;
  }

  const data = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value,
    fish: fish.join(", "),
    otherFish: otherFish.value.trim(),
    frequency: document.querySelector(
      'input[name="frequency"]:checked'
    ).value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  status.textContent = "Please wait...";
  status.className = "status";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    form.classList.add("hidden");
    successMessage.classList.remove("hidden");

    status.textContent = "";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {
    console.error(error);

    status.textContent =
      "Submission failed. Please check your internet connection and try again.";

    status.className = "status error";

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Survey";
  }
});

anotherBtn.addEventListener("click", () => {
  form.reset();

  updateOtherField();

  fishError.textContent = "";
  status.textContent = "";
  status.className = "status";

  successMessage.classList.add("hidden");
  form.classList.remove("hidden");

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Survey";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

updateOtherField();
