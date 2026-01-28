// admin-main-settings.js
document.addEventListener("DOMContentLoaded", function () {
  // Get Tavus API key input and Google Drive section
  const tavusApiKeyInput = document.getElementById(
    "avatar_studio_tavus_api_key"
  );
  const googleDriveSection = document.getElementById("google-drive-section");
  const googleDriveCheckbox = document.getElementById(
    "avatar_studio_enable_google_drive"
  );
  const googleDriveSettings = document.getElementById("google-drive-settings");

  // Function to check Tavus API key and toggle Google Drive section
  function toggleGoogleDriveSection() {
    const hasTavusKey = tavusApiKeyInput.value.trim() !== "";

    if (googleDriveSection) {
      if (hasTavusKey) {
        googleDriveSection.classList.remove("disabled");
        // Enable all inputs within Google Drive section
        document
          .querySelectorAll(
            "#google-drive-section input, #google-drive-section select, #google-drive-section button"
          )
          .forEach((input) => {
            input.disabled = false;
          });
        // Auto-enable Google Drive if it was previously enabled
      } else {
        googleDriveSection.classList.add("disabled");
        // Disable all inputs within Google Drive section
        document
          .querySelectorAll(
            "#google-drive-section input, #google-drive-section select, #google-drive-section button"
          )
          .forEach((input) => {
            input.disabled = true;
          });
        // Auto-disable Google Drive
        if (googleDriveCheckbox) {
          googleDriveCheckbox.checked = false;
          toggleGoogleDriveSettings();
        }
      }
    }
  }

  // Function to toggle Google Drive settings visibility
  function toggleGoogleDriveSettings() {
    if (googleDriveSettings && googleDriveCheckbox) {
      googleDriveSettings.style.display = googleDriveCheckbox.checked
        ? "block"
        : "none";
    }
  }

  // Initialize on page load
  toggleGoogleDriveSection();
  toggleGoogleDriveSettings();

  // Listen for changes in Tavus API key
  if (tavusApiKeyInput) {
    tavusApiKeyInput.addEventListener("input", toggleGoogleDriveSection);
    tavusApiKeyInput.addEventListener("change", toggleGoogleDriveSection);
  }

  // Listen for changes in Google Drive checkbox
  if (googleDriveCheckbox) {
    googleDriveCheckbox.addEventListener("change", toggleGoogleDriveSettings);
  }

  // Initialize collapsed states on page load
  document
    .querySelectorAll(".card-header.collapsible")
    .forEach(function (header) {
      const targetId = header.getAttribute("data-target");
      const body = document.getElementById(targetId);
      const toggle = header.querySelector(".collapse-toggle");

      if (body && body.classList.contains("collapsed")) {
        header.classList.add("collapsed-state");
        if (toggle) {
          toggle.classList.add("collapsed");
        }
      }
    });

  // Handle expand/collapse functionality
  document
    .querySelectorAll(".card-header.collapsible")
    .forEach(function (header) {
      header.addEventListener("click", function (e) {
        // Prevent collapse when clicking on child elements like toggles
        if (
          e.target.closest(".toggle-switch") ||
          e.target.closest(".toggle-label")
        ) {
          return;
        }

        // Don't allow collapsing if section is disabled
        if (this.closest(".conditional-section.disabled")) {
          return;
        }

        const targetId = this.getAttribute("data-target");
        const body = document.getElementById(targetId);
        const toggle = this.querySelector(".collapse-toggle");

        if (body && toggle) {
          body.classList.toggle("collapsed");
          toggle.classList.toggle("collapsed");
          this.classList.toggle("collapsed-state");
        }
      });
    });

  // Handle password visibility toggles
  document.querySelectorAll(".toggle-visibility").forEach(function (button) {
    button.addEventListener("click", function () {
      if (this.disabled) return;

      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (!input) return;

      // Check current state
      const isMasked =
        input.classList.contains("masked") || input.type === "password";

      if (isMasked) {
        // Show the content
        input.type = "text";
        input.classList.remove("masked");
        this.textContent = "Hide";
      } else {
        // Hide the content
        if (input.type === "password") {
          input.type = "password";
        }
        input.classList.add("masked");
        this.textContent = "Show";
      }
    });
  });

  // Handle main plugin enable/disable
  const enableCheckbox = document.getElementById("avatar_studio_enable");
  const allInputs = document.querySelectorAll(".plugin-input");
  const allToggleButtons = document.querySelectorAll(".toggle-visibility");

  function toggleAllInputs() {
    const enabled = enableCheckbox.checked;

    allInputs.forEach((input) => {
      if (input.id !== "avatar_studio_enable") {
        input.disabled = !enabled;
      }
    });

    allToggleButtons.forEach((btn) => {
      btn.disabled = !enabled;
    });

    // Collapse/Expand API sections based on plugin state
    const apiSections = [
      { body: "tavus-api-body", header: '[data-target="tavus-api-body"]' },
      { body: "heygen-api-body", header: '[data-target="heygen-api-body"]' },
    ];

    apiSections.forEach((section) => {
      const body = document.getElementById(section.body);
      const header = document.querySelector(section.header);

      if (body && header) {
        if (enabled) {
          // Plugin enabled - expand API sections
          body.classList.remove("collapsed");
          header.classList.remove("collapsed-state");
          header
            .querySelector(".collapse-toggle")
            ?.classList.remove("collapsed");
        } else {
          // Plugin disabled - collapse API sections
          body.classList.add("collapsed");
          header.classList.add("collapsed-state");
          header.querySelector(".collapse-toggle")?.classList.add("collapsed");
        }
      }
    });

    // Re-check Google Drive settings
    if (enabled) {
      toggleGoogleDriveSection();
      toggleGoogleDriveSettings();
    } else {
      if (googleDriveSettings) {
        googleDriveSettings.style.display = "none";
      }
    }
  }

  if (enableCheckbox) {
    toggleAllInputs(); // Initialize on page load
    enableCheckbox.addEventListener("change", toggleAllInputs);
  }
});
