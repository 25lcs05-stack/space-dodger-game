const defaultZones = [
  { id: "new-york", city: "New York", country: "United States", zone: "America/New_York" },
  { id: "london", city: "London", country: "United Kingdom", zone: "Europe/London" },
  { id: "paris", city: "Paris", country: "France", zone: "Europe/Paris" },
  { id: "tokyo", city: "Tokyo", country: "Japan", zone: "Asia/Tokyo" },
  { id: "sydney", city: "Sydney", country: "Australia", zone: "Australia/Sydney" },
  { id: "los-angeles", city: "Los Angeles", country: "United States", zone: "America/Los_Angeles" }
];

const cityDetails = {
  "America/Los_Angeles": ["Los Angeles", "United States"],
  "America/Chicago": ["Chicago", "United States"],
  "America/New_York": ["New York", "United States"],
  "America/Sao_Paulo": ["São Paulo", "Brazil"],
  "Europe/London": ["London", "United Kingdom"],
  "Europe/Paris": ["Paris", "France"],
  "Africa/Cairo": ["Cairo", "Egypt"],
  "Asia/Dubai": ["Dubai", "United Arab Emirates"],
  "Asia/Kolkata": ["Mumbai", "India"],
  "Asia/Singapore": ["Singapore", "Singapore"],
  "Asia/Tokyo": ["Tokyo", "Japan"],
  "Australia/Sydney": ["Sydney", "Australia"]
};

let zones = [...defaultZones];
let is24Hour = true;
const grid = document.querySelector("#clock-grid");
const localTime = document.querySelector("#local-time");
const localZone = document.querySelector("#local-zone");
const localDate = document.querySelector("#local-date");

const timeOptions = () => ({ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: !is24Hour });
const dateOptions = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
const zoneLabel = (zone) => zone.replace("_", " ").split("/").pop().replace(/\b\w/g, (letter) => letter.toUpperCase());

function renderCards() {
  document.querySelector("#zone-count").textContent = zones.length;
  grid.innerHTML = zones.map((item) => `
    <article class="clock-card" data-zone="${item.zone}">
      <button class="remove-zone" type="button" data-remove="${item.id}" aria-label="Remove ${item.city}">×</button>
      <h3>${item.city}</h3>
      <p class="country">${item.country} · ${zoneLabel(item.zone)}</p>
      <time class="clock-time">--:--:--</time>
      <p class="card-date">Loading...</p>
    </article>
  `).join("");
}

function updateClocks() {
  const now = new Date();
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  localZone.textContent = zoneLabel(localTimezone);
  localTime.textContent = new Intl.DateTimeFormat([], { ...timeOptions(), timeZone: localTimezone }).format(now);
  localDate.textContent = new Intl.DateTimeFormat([], dateOptions).format(now);

  document.querySelectorAll(".clock-card").forEach((card) => {
    const zone = card.dataset.zone;
    card.querySelector(".clock-time").textContent = new Intl.DateTimeFormat([], { ...timeOptions(), timeZone: zone }).format(now);
    card.querySelector(".card-date").textContent = new Intl.DateTimeFormat([], { ...dateOptions, timeZone: zone }).format(now);
  });
}

grid.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  zones = zones.filter((zone) => zone.id !== removeButton.dataset.remove);
  renderCards();
  updateClocks();
});

document.querySelector("#format-toggle").addEventListener("click", (event) => {
  is24Hour = !is24Hour;
  event.currentTarget.textContent = is24Hour ? "24-hour format" : "12-hour format";
  event.currentTarget.setAttribute("aria-pressed", String(!is24Hour));
  updateClocks();
});

document.querySelector("#add-zone-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const select = document.querySelector("#zone-select");
  const zone = select.value;
  if (zones.some((item) => item.zone === zone)) return;
  const [city, country] = cityDetails[zone];
  zones.push({ id: zone.toLowerCase().replace(/[^a-z]+/g, "-"), city, country, zone });
  renderCards();
  updateClocks();
});

renderCards();
updateClocks();
setInterval(updateClocks, 1000);
