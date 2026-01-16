// avatar-settings.js
jQuery(document).ready(function ($) {
  // ========== LiveKit & API Settings ==========
  let headerIndex = parseInt(
    $("#headers-container").data("initial-index") || 0
  );

  // Toggle API settings sections based on LiveKit checkbox
  function toggleApiSections() {
    if ($("#livekit_enable").is(":checked")) {
      $("#api-settings-row").show();
      $("#headers-section").show();
    } else {
      $("#api-settings-row").hide();
      $("#headers-section").hide();
    }
  }

  // Update required fields for LiveKit
  function toggleRequiredFields() {
    if ($("#livekit_enable").is(":checked")) {
      $("#RAG_API_URL").attr("required", "required");
      $("#deepgramKEY").attr("required", "required");
      $("#rag_label").html(
        '<strong>Custom RAG API URL <span style="color: black;">*</span></strong>'
      );
      $("#deepgram_label").html(
        '<strong>Deepgram API Key <span style="color: black;">*</span></strong>'
      );
    } else {
      $("#RAG_API_URL").removeAttr("required");
      $("#deepgramKEY").removeAttr("required");
      $("#rag_label").html("<strong>Custom RAG API URL</strong>");
      $("#deepgram_label").html("<strong>Deepgram API Key</strong>");
    }
  }

  // Update headers count
  function updateHeadersCount() {
    const count = $(".header-row").length;
    $("#headers-count").text(count + " header(s) configured");
  }

  // Add new header row
  $("#add-header").on("click", function () {
    const rowHtml = `
            <div class="header-row" data-index="${headerIndex}">
                <div class="header-inputs">
                    <div class="header-input-group">
                        <span class="header-label">Key</span>
                        <input type="text" 
                            name="headers[${headerIndex}][key]" 
                            placeholder="e.g., Authorization, X-API-Key, Content-Type"
                            value=""
                            class="header-key">
                    </div>
                    <div class="header-input-group">
                        <span class="header-label">Value</span>
                        <input type="text" 
                            name="headers[${headerIndex}][value]" 
                            placeholder="e.g., Bearer token_here, application/json"
                            value=""
                            class="header-value">
                    </div>
                </div>
                <button type="button" class="button button-secondary remove-header" title="Remove this header">
                    <span class="dashicons dashicons-trash"></span>
                </button>
            </div>
        `;
    $("#headers-container").append(rowHtml);
    headerIndex++;
    updateHeadersCount();

    // Focus on the new key input
    $("#headers-container .header-row:last-child .header-key").focus();
  });

  // Remove header row
  $(document).on("click", ".remove-header", function () {
    const $row = $(this).closest(".header-row");
    const totalRows = $(".header-row").length;

    // Don't remove if it's the last row (keep at least one)
    if (totalRows > 1) {
      $row.fadeOut(300, function () {
        $(this).remove();
        reindexHeaders();
        updateHeadersCount();
      });
    } else {
      // Clear the last row instead of removing it
      $row.find(".header-key, .header-value").val("");
      $row.find(".header-key").focus();
    }
  });

  // Reindex header rows after removal
  function reindexHeaders() {
    $(".header-row").each(function (index) {
      $(this).attr("data-index", index);
      $(this).find(".header-key").attr("name", `headers[${index}][key]`);
      $(this).find(".header-value").attr("name", `headers[${index}][value]`);
    });
    headerIndex = $(".header-row").length;
  }

  // Auto-focus next input when Enter is pressed in key field
  $(document).on("keydown", ".header-key", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $(this).closest(".header-row").find(".header-value").focus();
    }
  });

  // Auto-focus next row or add new when Enter is pressed in value field
  $(document).on("keydown", ".header-value", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const $row = $(this).closest(".header-row");
      const $nextRow = $row.next(".header-row");

      if ($nextRow.length > 0) {
        $nextRow.find(".header-key").focus();
      } else {
        $("#add-header").click();
      }
    }
  });

  // ========== Disclaimer Section ==========
  function toggleDisclaimerFields(isEnabled) {
    const disclaimerFieldsRow = document.getElementById(
      "disclaimer_fields_row"
    );
    const titleInput = document.getElementById("disclaimer_title");

    if (isEnabled) {
      disclaimerFieldsRow.style.display = "";
      if (titleInput) {
        titleInput.required = true;
      }
      // For TinyMCE editor
      if (window.tinymce && window.tinymce.get("disclaimer_editor")) {
        window.tinymce
          .get("disclaimer_editor")
          .getBody()
          .setAttribute("required", "true");
      }
    } else {
      disclaimerFieldsRow.style.display = "none";
      if (titleInput) {
        titleInput.required = false;
        titleInput.removeAttribute("required");
      }
      // For TinyMCE editor
      if (window.tinymce && window.tinymce.get("disclaimer_editor")) {
        window.tinymce
          .get("disclaimer_editor")
          .getBody()
          .removeAttribute("required");
      }
      // Hide error messages
      document.getElementById("disclaimer_title_error").style.display = "none";
      document.getElementById("disclaimer_content_error").style.display =
        "none";
    }
  }

  // ========== User Form Section ==========
  function toggleFormSelection(checkbox) {
    const formRow = document.getElementById("form_selection_row");
    const selectField = document.getElementById("selected_form_id");

    if (checkbox.checked) {
      formRow.style.display = "table-row";
      selectField.required = true;
    } else {
      formRow.style.display = "none";
      selectField.required = false;
      selectField.value = "0";
    }
  }

  // ========== Video Instructions Section ==========
  function toggleInstructionFields(isEnabled) {
    const skipInstructionRow = document.getElementById("skip_instruction_row");
    const instructionFieldsRow = document.getElementById(
      "instruction_fields_row"
    );
    const titleInput = document.getElementById("instruction_title");

    if (isEnabled) {
      skipInstructionRow.style.display = "";
      instructionFieldsRow.style.display = "";

      if (titleInput) {
        titleInput.required = true;
      }

      // For TinyMCE editor
      if (window.tinymce && window.tinymce.get("instruction_editor")) {
        window.tinymce
          .get("instruction_editor")
          .getBody()
          .setAttribute("required", "true");
      }

      // Hide error messages when enabling
      document.getElementById("instruction_title_error").style.display = "none";
      document.getElementById("instruction_content_error").style.display =
        "none";
    } else {
      skipInstructionRow.style.display = "none";
      instructionFieldsRow.style.display = "none";

      if (titleInput) {
        titleInput.required = false;
        titleInput.removeAttribute("required");
      }

      // For TinyMCE editor
      if (window.tinymce && window.tinymce.get("instruction_editor")) {
        window.tinymce
          .get("instruction_editor")
          .getBody()
          .removeAttribute("required");
      }

      // Hide error messages
      document.getElementById("instruction_title_error").style.display = "none";
      document.getElementById("instruction_content_error").style.display =
        "none";
    }
  }

  // ========== Flash Notifications (Toast Messages) ==========
  let toastIndex = parseInt(
    $("#toast-messages-container").data("initial-index") || 0
  );
  let timeLimit = 3600; // Default 60 minutes in seconds

  // Update time limit from the time_limit input
  function updateTimeLimit() {
    const minutes = $("#time_limit").val();
    if (minutes && !isNaN(minutes)) {
      timeLimit = minutes * 60; // Convert to seconds
    }
  }

  // Update toast messages count
  function updateToastMessagesCount() {
    const count = $(".toast-message-row").length;
    $("#toast-messages-count").text(count + " message(s) configured");
  }

  // Toggle required fields based on message input
  function toggleToastRequiredFields($row) {
    const $messageInput = $row.find(".toast-message");
    const $typeSelect = $row.find(".toast-type");
    const $timeInput = $row.find(".toast-time");
    const $hideAfterInput = $row.find(".toast-hideafter");

    const hasMessage = $messageInput.val().trim() !== "";

    if (hasMessage) {
      $typeSelect.attr("required", "required");
      $timeInput.attr("required", "required");
      $hideAfterInput.attr("required", "required");
    } else {
      $typeSelect.removeAttr("required");
      $timeInput.removeAttr("required");
      $hideAfterInput.removeAttr("required");
      $typeSelect.css("border-color", "#ddd");
      $timeInput.css("border-color", "#ddd");
      $hideAfterInput.css("border-color", "#ddd");
    }
  }

  // Validate type selection
  function validateToastType($select) {
    const $row = $select.closest(".toast-message-row");
    const $messageInput = $row.find(".toast-message");
    const hasMessage = $messageInput.val().trim() !== "";
    const hasType = $select.val() !== "";

    if (hasMessage && !hasType) {
      $select.css("border-color", "#dc3545");
      return false;
    } else {
      $select.css("border-color", "#ddd");
      return true;
    }
  }

  // Validate hideAfter field
  function validateHideAfter($input) {
    const hideAfter = parseInt($input.val());
    const $row = $input.closest(".toast-message-row");
    const $validation = $row.find(".toast-hideafter-validation");
    const $messageInput = $row.find(".toast-message");
    const hasMessage = $messageInput.val().trim() !== "";

    // Clear previous validation
    $validation.hide().text("");
    $input.css("border-color", "#ddd");

    if (hasMessage) {
      if (isNaN(hideAfter)) {
        $validation.text("").show();
        $input.css("border-color", "#dc3545");
        return false;
      }

      if (hideAfter < 2) {
        $validation.text("Minimum hide time is 2 seconds").show();
        $input.css("border-color", "#dc3545");
        return false;
      }

      if (hideAfter > 30) {
        $validation.text("Maximum hide time is 30 seconds").show();
        $input.css("border-color", "#dc3545");
        return false;
      }
    }

    return true;
  }

  // Validate toast time with 2-second gap rule
  function validateToastTime($input) {
    const time = parseInt($input.val());
    const $row = $input.closest(".toast-message-row");
    const $validation = $row.find(".toast-time-validation");
    const allMessages = [];
    const $messageInput = $row.find(".toast-message");
    const $typeSelect = $row.find(".toast-type");
    const $hideAfterInput = $row.find(".toast-hideafter");
    const hasMessage = $messageInput.val().trim() !== "";
    const hasType = $typeSelect.val() !== "";
    const hideAfter = parseInt($hideAfterInput.val()) || 5;

    // Collect all messages data
    $(".toast-message-row").each(function () {
      const $thisRow = $(this);
      if (this !== $row[0]) {
        const otherTime = parseInt($thisRow.find(".toast-time").val());
        const otherHideAfter =
          parseInt($thisRow.find(".toast-hideafter").val()) || 5;
        const otherMessage = $thisRow.find(".toast-message").val().trim();

        if (otherMessage !== "" && !isNaN(otherTime)) {
          allMessages.push({
            time: otherTime,
            hideAfter: otherHideAfter,
            endTime: otherTime + otherHideAfter,
          });
        }
      }
    });

    // Clear previous validation
    $validation.hide().text("");
    $input.css("border-color", "#ddd");

    if (hasMessage) {
      // Validate type if message exists
      if (!hasType) {
        $typeSelect.css("border-color", "#dc3545");
        $validation.text("").show();
        $input.css("border-color", "#dc3545");
        return false;
      } else {
        $typeSelect.css("border-color", "#ddd");
      }

      // Validate time if message exists
      if (isNaN(time)) {
        $validation.text("").show();
        $input.css("border-color", "#dc3545");
        return false;
      }

      if (time < 1) {
        $validation.text("Time must be at least 1 second").show();
        $input.css("border-color", "#dc3545");
        return false;
      }

      if (time > timeLimit) {
        $validation
          .text(
            "Time cannot exceed session limit (" + timeLimit / 60 + " minutes)"
          )
          .show();
        $input.css("border-color", "#dc3545");
        return false;
      }

      // New validation: Check for overlapping messages with 2-second gap rule
      const currentEndTime = time + hideAfter;

      for (const msg of allMessages) {
        // Check if messages overlap
        const gapBefore = time - msg.endTime;
        const gapAfter = msg.time - currentEndTime;

        // Check for overlap
        if (
          (time >= msg.time && time <= msg.endTime) ||
          (currentEndTime >= msg.time && currentEndTime <= msg.endTime) ||
          (time <= msg.time && currentEndTime >= msg.endTime)
        ) {
          $validation
            .text("Messages cannot overlap. Minimum 2-second gap required")
            .show();
          $input.css("border-color", "#dc3545");
          return false;
        }

        // Check for 2-second gap rule
        if (gapBefore >= 0 && gapBefore < 2) {
          $validation
            .text(
              `Need at least 2-second gap after message ending at ${msg.endTime}s`
            )
            .show();
          $input.css("border-color", "#dc3545");
          return false;
        }

        if (gapAfter >= 0 && gapAfter < 2) {
          $validation
            .text(
              `Need at least 2-second gap before message starting at ${msg.time}s`
            )
            .show();
          $input.css("border-color", "#dc3545");
          return false;
        }
      }

      // Check for duplicate times (exact same time)
      const duplicateTimes = allMessages.filter((msg) => msg.time === time);
      if (duplicateTimes.length > 0) {
        $validation.text("This time is already used by another message").show();
        $input.css("border-color", "#dc3545");
        return false;
      }
    } else {
      // If no message, clear any validation and remove required
      $typeSelect.css("border-color", "#ddd");
      $typeSelect.removeAttr("required");
      $input.removeAttr("required");
    }

    return true;
  }

  // Validate all toast times and types
  function validateAllToastTimesAndTypes() {
    let allValid = true;
    $(".toast-message-row").each(function () {
      const $row = $(this);
      const $messageInput = $row.find(".toast-message");
      const $typeSelect = $row.find(".toast-type");
      const $timeInput = $row.find(".toast-time");
      const $hideAfterInput = $row.find(".toast-hideafter");

      const hasMessage = $messageInput.val().trim() !== "";

      if (hasMessage) {
        if (!validateToastType($typeSelect)) {
          allValid = false;
        }

        if (!validateToastTime($timeInput)) {
          allValid = false;
        }

        if (!validateHideAfter($hideAfterInput)) {
          allValid = false;
        }
      }
    });
    return allValid;
  }

  // Add new toast message row
  $("#add-toast-message").on("click", function () {
    const rowHtml = `
            <div class="toast-message-row" data-index="${toastIndex}">
                <div class="toast-message-inputs">
                    <div class="toast-input-group message-group">
                        <span class="toast-label">Message</span>
                        <input type="text" 
                            name="toast_messages[${toastIndex}][message]" 
                            placeholder="Enter your message here..."
                            value=""
                            class="toast-message">
                    </div>
                    
                    <div class="toast-input-group type-group">
                        <span class="toast-label">Type</span>
                        <select name="toast_messages[${toastIndex}][type]" class="toast-type">
                            <option value="">Select Type</option>
                            <option value="success">Success</option>
                            <option value="error">Error</option>
                            <option value="warn">Warn</option>
                            <option value="info">Info</option>
                        </select>
                    </div>
                    
                    <div class="toast-input-group time-group">
                        <span class="toast-label">Show At (seconds)</span>
                        <div class="time-input-wrapper">
                            <input type="number" 
                                name="toast_messages[${toastIndex}][time]" 
                                placeholder="Sec"
                                min="1"
                                value=""
                                class="toast-time">
                        </div>
                        <div class="toast-time-validation" style="display: none; color: #dc3545; font-size: 12px; margin-top: 4px;"></div>
                    </div>
                    
                    <div class="toast-input-group hideafter-group">
                        <span class="toast-label">Display for (seconds)</span>
                        <div class="time-input-wrapper">
                            <input type="number" 
                                name="toast_messages[${toastIndex}][hideAfter]" 
                                placeholder="Sec"
                                min="2"
                                max="30"
                                value=""
                                class="toast-hideafter">
                        </div>
                        <div class="toast-hideafter-validation" style="display: none; color: #dc3545; font-size: 12px; margin-top: 4px;"></div>
                        <small style="display: block; color: #666; font-size: 11px; margin-top: 2px;">Min: 2s, Max: 30s</small>
                    </div>
                </div>
                <button style="margin-top: 24px;" type="button" class="button button-secondary remove-toast-message" title="Remove this toast message">
                    <span class="dashicons dashicons-trash"></span>
                </button>
            </div>
        `;

    $("#toast-messages-container").append(rowHtml);
    toastIndex++;
    updateToastMessagesCount();

    // Focus on the new message input
    $(
      "#toast-messages-container .toast-message-row:last-child .toast-message"
    ).focus();

    // Initialize required fields for the new row
    toggleToastRequiredFields(
      $("#toast-messages-container .toast-message-row:last-child")
    );
  });

  // Remove toast message row
  $(document).on("click", ".remove-toast-message", function () {
    const $row = $(this).closest(".toast-message-row");
    const totalRows = $(".toast-message-row").length;

    if (totalRows > 1) {
      $row.fadeOut(300, function () {
        $(this).remove();
        reindexToastMessages();
        updateToastMessagesCount();
        validateAllToastTimesAndTypes();
      });
    } else {
      // Clear the last row instead of removing it
      $row.find(".toast-message, .toast-time, .toast-hideafter").val("");
      $row.find(".toast-type").val("");
      $row.find(".toast-message").focus();
      toggleToastRequiredFields($row);
      validateAllToastTimesAndTypes();
    }
  });

  // Reindex toast message rows after removal
  function reindexToastMessages() {
    $(".toast-message-row").each(function (index) {
      $(this).attr("data-index", index);
      $(this)
        .find(".toast-message")
        .attr("name", `toast_messages[${index}][message]`);
      $(this)
        .find(".toast-type")
        .attr("name", `toast_messages[${index}][type]`);
      $(this)
        .find(".toast-time")
        .attr("name", `toast_messages[${index}][time]`);
      $(this)
        .find(".toast-hideafter")
        .attr("name", `toast_messages[${index}][hideAfter]`);
    });
    toastIndex = $(".toast-message-row").length;
  }

  // ========== Event Listeners Initialization ==========

  // LiveKit toggle events
  $("#livekit_enable").on("change", function () {
    toggleApiSections();
    toggleRequiredFields();
  });

  // Disclaimer events
  const disclaimerCheckbox = document.getElementById("disclaimer_enable");
  if (disclaimerCheckbox) {
    disclaimerCheckbox.addEventListener("change", function () {
      toggleDisclaimerFields(this.checked);
    });
  }

  // User form events
  const userFormCheckbox = document.getElementById("user_form_enable");
  if (userFormCheckbox) {
    userFormCheckbox.addEventListener("change", function () {
      toggleFormSelection(this);
    });
  }

  // Video instructions events
  const instructionCheckbox = document.getElementById("instruction_enable");
  if (instructionCheckbox) {
    instructionCheckbox.addEventListener("change", function () {
      toggleInstructionFields(this.checked);
    });
  }

  // Toast message events
  $(document).on("input", ".toast-message", function () {
    const $row = $(this).closest(".toast-message-row");
    toggleToastRequiredFields($row);
    validateAllToastTimesAndTypes();
  });

  $(document).on("change", ".toast-type", function () {
    validateToastType($(this));
    validateAllToastTimesAndTypes();
  });

  $(document).on("blur", ".toast-time", function () {
    validateToastTime($(this));
  });

  // HideAfter field events
  $(document).on("input", ".toast-hideafter", function () {
    validateHideAfter($(this));
    // Re-validate all times when hideAfter changes
    $(".toast-time").each(function () {
      validateToastTime($(this));
    });
  });

  $(document).on("blur", ".toast-hideafter", function () {
    validateHideAfter($(this));
    validateAllToastTimesAndTypes();
  });

  // Time limit monitor
  $("#time_limit").on("change input", function () {
    updateTimeLimit();
    validateAllToastTimesAndTypes();
  });

  // Show/hide tooltip on mobile
  $(".tooltip-icon").on("click", function () {
    if ($(window).width() <= 768) {
      alert($(this).attr("title"));
    }
  });

  // ========== Form Validation ==========
  $("form").on("submit", function (e) {
    // Disclaimer validation
    const disclaimerEnabled = $("#disclaimer_enable").is(":checked");
    if (disclaimerEnabled) {
      const disclaimerTitle = $("#disclaimer_title").val().trim();
      const disclaimerEditor = window.tinymce
        ? window.tinymce.get("disclaimer_editor")
        : null;
      const disclaimerContent = disclaimerEditor
        ? disclaimerEditor.getContent().trim()
        : "";

      if (!disclaimerTitle) {
        e.preventDefault();
        $("#disclaimer_title_error").show();
        $("#disclaimer_title").focus();
        alert("Please fill in all required disclaimer fields.");
        return false;
      }

      if (!disclaimerContent) {
        e.preventDefault();
        $("#disclaimer_content_error").show();
        if (disclaimerEditor) disclaimerEditor.focus();
        alert("Please fill in all required disclaimer fields.");
        return false;
      }
    }

    // User form validation
    const userFormEnabled = $("#user_form_enable").is(":checked");
    const formSelected = $("#selected_form_id").val();

    if (userFormEnabled && (formSelected === "0" || formSelected === "")) {
      e.preventDefault();
      const selectField = $("#selected_form_id");
      selectField.css({
        "border-color": "#dc3232",
        "box-shadow": "0 0 0 1px #dc3232",
      });
      alert("Please select a form when User Form is enabled.");
      selectField.focus();
      return false;
    }

    // Video instructions validation
    const instructionEnabled = $("#instruction_enable").is(":checked");
    if (instructionEnabled) {
      const instructionTitle = $("#instruction_title").val().trim();
      const instructionEditor = window.tinymce
        ? window.tinymce.get("instruction_editor")
        : null;
      const instructionContent = instructionEditor
        ? instructionEditor.getContent().trim()
        : "";

      if (!instructionTitle) {
        e.preventDefault();
        $("#instruction_title_error").show();
        $("#instruction_title").focus();
        alert("Please fill in all required video instruction fields.");
        return false;
      }

      if (!instructionContent) {
        e.preventDefault();
        $("#instruction_content_error").show();
        if (instructionEditor) instructionEditor.focus();
        alert("Please fill in all required video instruction fields.");
        return false;
      }
    }

    // Toast messages validation
    if (!validateAllToastTimesAndTypes()) {
      e.preventDefault();
      alert("Please fix the toast message validation errors before saving.");
      $(
        ".toast-message-row:has(.toast-message:not(:empty)) .toast-type:invalid, .toast-time:invalid, .toast-hideafter:invalid"
      )
        .first()
        .focus();
      return false;
    }
  });

  // Real-time validation for disclaimer title
  $("#disclaimer_title").on("input", function () {
    const disclaimerEnabled = $("#disclaimer_enable").is(":checked");
    if (disclaimerEnabled && !$(this).val().trim()) {
      $("#disclaimer_title_error").show();
    } else {
      $("#disclaimer_title_error").hide();
    }
  });

  // Real-time validation for disclaimer TinyMCE editor
  if (window.tinymce && window.tinymce.get("disclaimer_editor")) {
    const disclaimerEditor = window.tinymce.get("disclaimer_editor");
    disclaimerEditor.on("keyup change", function () {
      const disclaimerEnabled = $("#disclaimer_enable").is(":checked");
      const content = disclaimerEditor.getContent().trim();
      if (disclaimerEnabled && !content) {
        $("#disclaimer_content_error").show();
      } else {
        $("#disclaimer_content_error").hide();
      }
    });
  }

  // Real-time validation for instruction title
  $("#instruction_title").on("input", function () {
    const instructionEnabled = $("#instruction_enable").is(":checked");
    if (instructionEnabled && !$(this).val().trim()) {
      $("#instruction_title_error").show();
    } else {
      $("#instruction_title_error").hide();
    }
  });

  // Real-time validation for instruction TinyMCE editor
  if (window.tinymce && window.tinymce.get("instruction_editor")) {
    const instructionEditor = window.tinymce.get("instruction_editor");
    instructionEditor.on("keyup change", function () {
      const instructionEnabled = $("#instruction_enable").is(":checked");
      const content = instructionEditor.getContent().trim();
      if (instructionEnabled && !content) {
        $("#instruction_content_error").show();
      } else {
        $("#instruction_content_error").hide();
      }
    });
  }

  // ========== Initialization ==========
  // Set initial indices for dynamic content
  headerIndex = $(".header-row").length;
  toastIndex = $(".toast-message-row").length;

  // Initial toggle states
  toggleApiSections();
  toggleRequiredFields();

  // Initialize counts
  updateHeadersCount();
  updateToastMessagesCount();
  updateTimeLimit();

  // Initialize required fields for existing rows
  $(".toast-message-row").each(function () {
    toggleToastRequiredFields($(this));
  });

  // Initialize validation
  validateAllToastTimesAndTypes();

  // Initialize TinyMCE editors if needed
  if (window.tinymce) {
    // Trigger initial validation for editors
    setTimeout(function () {
      if (window.tinymce.get("disclaimer_editor")) {
        window.tinymce.get("disclaimer_editor").fire("change");
      }
      if (window.tinymce.get("instruction_editor")) {
        window.tinymce.get("instruction_editor").fire("change");
      }
    }, 500);
  }
});
