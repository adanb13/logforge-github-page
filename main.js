const STRIPE_PAYMENT_LINKS = {
  personal: "REPLACE_WITH_PERSONAL_STRIPE_PAYMENT_LINK",
  business: "REPLACE_WITH_BUSINESS_STRIPE_PAYMENT_LINK",
};

const GITHUB_URL = "https://github.com/log-forge/logforge";

const DEPOSIT_AMOUNTS = {
  personal: 50,
  business: 500,
};

const TIER_LABELS = {
  personal: "Personal",
  business: "Business",
};

window.STRIPE_PAYMENT_LINKS = STRIPE_PAYMENT_LINKS;
window.GITHUB_URL = GITHUB_URL;

function formatDepositAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function isConfiguredUrl(url) {
  if (typeof url !== "string") {
    return false;
  }

  const value = url.trim();
  const placeholderPattern = /^(REPLACE_|YOUR_|TODO|#|$)/i;

  if (placeholderPattern.test(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSelectedTier(form) {
  const formData = new FormData(form);
  const selectedTier = formData.get("tier");
  return Object.prototype.hasOwnProperty.call(DEPOSIT_AMOUNTS, selectedTier)
    ? selectedTier
    : "personal";
}

function setMessage(messageElement, message) {
  messageElement.textContent = message;
  messageElement.hidden = !message;
}

function configureGithubLink(link) {
  if (isConfiguredUrl(GITHUB_URL)) {
    link.href = GITHUB_URL.trim();
    link.target = "_blank";
    link.rel = "noreferrer";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
    return;
  }

  link.href = "#github";
  link.setAttribute("aria-disabled", "true");
  link.title = "Replace GITHUB_URL in main.js before launch.";
  link.addEventListener("click", (event) => event.preventDefault());
}

function initDepositPage() {
  const form = document.querySelector("#depositForm");
  const amountElement = document.querySelector("#depositAmount");
  const messageElement = document.querySelector("#configMessage");
  const githubLinks = document.querySelectorAll("#githubHeaderLink, #githubProjectLink");

  githubLinks.forEach(configureGithubLink);

  if (!form || !amountElement || !messageElement) {
    return;
  }

  const tierInputs = form.querySelectorAll('input[name="tier"]');

  function updateAmount() {
    const tier = getSelectedTier(form);
    amountElement.textContent = formatDepositAmount(DEPOSIT_AMOUNTS[tier]);
    setMessage(messageElement, "");
  }

  tierInputs.forEach((input) => {
    input.addEventListener("change", updateAmount);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const tier = getSelectedTier(form);
    const paymentLink = STRIPE_PAYMENT_LINKS[tier];

    if (!isConfiguredUrl(paymentLink)) {
      setMessage(
        messageElement,
        `Stripe Payment Link for ${TIER_LABELS[tier]} is not configured yet. Replace STRIPE_PAYMENT_LINKS.${tier} in main.js before taking deposits.`
      );
      return;
    }

    window.location.assign(paymentLink.trim());
  });

  updateAmount();
}

document.addEventListener("DOMContentLoaded", initDepositPage);
