// === Theme toggle & share ===
function toggleMode() {
  const body = document.body;
  const icon = document.getElementById("theme-icon");

  // Add rotate animation to the icon
  icon.classList.add('animate');

  // Remove the animation class after animation ends
  icon.addEventListener('animationend', function handler() {
    icon.classList.remove('animate');
    icon.removeEventListener('animationend', handler);
  });

  // Toggle the light mode
  body.classList.toggle("light-mode");

  // No icon change needed now (sun icon will stay always)
}

// === Share page ===
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: "My Digital Card",
      text: "Check out my profile!",
      url: window.location.href
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.log('Sharing failed:', error));
  } else {
    alert("Sharing not supported on this browser.");
  }
}

function toggleSocialFab(button) {
  const fab = document.querySelector(".fab-container");
  fab.classList.toggle("show");

  // Trigger animation every time
  button.classList.remove("rotate");
  void button.offsetWidth; // Trick to reflow
  button.classList.add("rotate");
}

// === Character Image Fade-in Loader ===
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".char-card img");

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
      img.addEventListener("error", () => {
        img.classList.add("loaded");
        // Optional fallback image
        // img.src = "images/placeholder.webp";
      });
    }
  });
});
