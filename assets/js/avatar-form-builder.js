(function ($) {
  "use strict";

  // Global variables
  let currentFormId = null;
  let formFields = [];
  let formMeta = {};
  let selectedFieldId = null;

  // Initialize
  $(document).ready(function () {
    initFormBuilder();
    bindEvents();
  });

  function initFormBuilder() {
    // Show modal
    $("#createNewFormBtn").on("click", function () {
      resetFormBuilder();
      $("#formCreationModal").addClass("active");
    });

    // Close modal
    $(".avatar-modal-close, .close-modal").on("click", function () {
      $("#formCreationModal").removeClass("active");
    });

    // Proceed to builder
    $("#proceedToBuilder").on("click", function () {
      const title = $("#form_title").val().trim();
      const description = $("#form_description").val().trim();

      if (!title) {
        alert("Please enter a form title");
        return;
      }

      formMeta = { title, description };
      $("#formCreationModal").removeClass("active");
      $("#formsListContainer").hide();
      $("#formBuilderInterface").show();
      $("#builderTitle").text("Building: " + formMeta.title);

      initDragAndDrop();
    });

    // Close builder
    $("#closeBuilder").on("click", function () {
      if (
        formFields.length > 0 &&
        !confirm("Are you sure? Unsaved changes will be lost.")
      ) {
        return;
      }
      $("#formBuilderInterface").hide();
      $("#formsListContainer").show();
    });
  }

  function bindEvents() {
    // Edit existing form
    $(document).on("click", ".edit-form-btn", function (e) {
      e.preventDefault();
      const formId = $(this).data("id");

      $.ajax({
        url: avatarFormBuilder.ajax_url,
        type: "GET",
        data: {
          action: "get_avatar_form",
          form_id: formId,
          nonce: avatarFormBuilder.get_form_nonce,
        },
        beforeSend: function () {
          // Show loading state
        },
        success: function (response) {
          if (response.success) {
            currentFormId = formId;
            formMeta = {
              title: response.data.title,
              description: response.data.description,
            };
            formFields = response.data.fields || [];

            // Populate modal
            $("#form_title").val(formMeta.title);
            $("#form_description").val(formMeta.description);

            // Show modal with different behavior
            $("#formCreationModal").addClass("active");

            // Update proceed button for editing
            $("#proceedToBuilder")
              .off("click")
              .on("click", function () {
                const title = $("#form_title").val().trim();
                const description = $("#form_description").val().trim();

                if (!title) {
                  alert("Please enter a form title");
                  return;
                }

                formMeta = { title, description };
                $("#formCreationModal").removeClass("active");
                $("#formsListContainer").hide();
                $("#formBuilderInterface").show();
                $("#builderTitle").text("Editing: " + formMeta.title);

                // Initialize with existing fields
                initFormBuilderWithExistingFields();
              });
          } else {
            alert("Error loading form: " + response.data);
          }
        },
        error: function () {
          alert("Network error. Please try again.");
        },
      });
    });

    // Delete form
    $(document).on("click", ".delete-form-btn", function (e) {
      e.preventDefault();
      const formId = $(this).data("id");

      if (
        confirm(
          "Are you sure you want to delete this form? All submissions will also be deleted."
        )
      ) {
        $.ajax({
          url: avatarFormBuilder.ajax_url,
          type: "POST",
          data: {
            action: "delete_avatar_form",
            form_id: formId,
            nonce: avatarFormBuilder.delete_form_nonce,
          },
          beforeSend: function () {
            $(this).prop("disabled", true).text("Deleting...");
          },
          success: function (response) {
            if (response.success) {
              location.reload();
            } else {
              alert("Error deleting form");
              $(".delete-form-btn").prop("disabled", false).text("Delete");
            }
          },
          error: function () {
            alert("Network error. Please try again.");
            $(".delete-form-btn").prop("disabled", false).text("Delete");
          },
        });
      }
    });
  }

  function initDragAndDrop() {
    // Make fields draggable
    $(".draggable-field").draggable({
      helper: "clone",
      revert: "invalid",
      cursor: "move",
      zIndex: 100,
      start: function (event, ui) {
        $(this).addClass("dragging");
      },
      stop: function (event, ui) {
        $(this).removeClass("dragging");
      },
    });

    // Make preview area droppable
    $("#formPreviewContainer")
      .droppable({
        accept: ".draggable-field",
        activeClass: "droppable-active",
        hoverClass: "droppable-hover",
        drop: function (event, ui) {
          const fieldType = ui.draggable.data("type");
          addFormField(fieldType);
        },
      })
      .sortable({
        items: ".form-field",
        placeholder: "sortable-placeholder",
        cursor: "move",
        opacity: 0.7,
        update: function () {
          saveFieldOrder();
        },
      });
  }

  function initFormBuilderWithExistingFields() {
    initDragAndDrop();
    updateFormPreview();
    updateFieldCount();

    if (formFields.length > 0) {
      $("#noFieldsMessage").hide();
      if (formFields.length > 0) {
        selectField(formFields[0].id);
      }
    } else {
      $("#noFieldsMessage").show();
    }
  }

  function addFormField(type) {
    const fieldId = "field_" + Date.now();
    const defaultLabel =
      type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1");

    const field = {
      id: fieldId,
      type: type,
      label: defaultLabel,
      required: false,
      placeholder: "",
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : [],
    };

    formFields.push(field);
    updateFormPreview();
    updateFieldCount();
    $("#noFieldsMessage").hide();

    // Select the new field
    selectField(fieldId);
  }

  function updateFormPreview() {
    const $preview = $("#previewForm");
    $preview.empty();

    formFields.forEach((field, index) => {
      const fieldHtml = generateFieldHtml(field, index);
      $preview.append(fieldHtml);
    });

    // Make fields in preview selectable
    $(".form-field")
      .off("click")
      .on("click", function (e) {
        // Check if click is on delete button first
        if ($(e.target).closest(".field-action-btn.delete-field").length) {
          return;
        }

        // Check if click is on edit button
        if ($(e.target).closest(".field-action-btn.edit-field").length) {
          const fieldId = $(this).attr("id");
          // Don't select the field, just trigger edit
          return;
        }

        // Regular field selection
        if (!$(e.target).closest(".field-actions").length) {
          const fieldId = $(this).attr("id");
          selectField(fieldId);
        }
      });

    // Bind edit button click events separately
    $(".edit-field")
      .off("click")
      .on("click", function (e) {
        e.stopPropagation(); // Prevent field selection
        const fieldId = $(this).data("id");
        const field = formFields.find((f) => f.id === fieldId);

        if (field) {
          // Select the field first
          $(".form-field").removeClass("selected");
          $(`#${fieldId}`).addClass("selected");
          selectedFieldId = fieldId;

          // Then show settings
          showFieldSettings(field);

          // Scroll to settings panel
          $(".field-settings-panel")[0].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });

    // Bind delete button click events
    $(".delete-field")
      .off("click")
      .on("click", function (e) {
        e.stopPropagation();
        const fieldId = $(this).data("id");

        if (confirm("Are you sure you want to delete this field?")) {
          formFields = formFields.filter((f) => f.id !== fieldId);
          updateFormPreview();
          updateFieldCount();

          if (formFields.length === 0) {
            $("#noFieldsMessage").show();
            $("#fieldSettings").html(
              '<p class="no-field-selected">Select a field to edit its settings.</p>'
            );
          } else if (selectedFieldId === fieldId) {
            selectedFieldId = null;
            $("#fieldSettings").html(
              '<p class="no-field-selected">Select a field to edit its settings.</p>'
            );
          }
        }
      });
  }

  function generateFieldHtml(field, index) {
    let html = `<div class="form-field" id="${field.id}" data-index="${index}">`;
    html += `<div class="field-header">`;
    html += `<span class="field-label"><i class="dashicons dashicons-${getFieldIcon(
      field.type
    )}"></i> ${field.label}</span>`;
    html += `<span class="field-actions">`;
    html += `<button type="button" class="field-action-btn edit-field" data-id="${field.id}" title="Edit field"><span class="dashicons dashicons-edit"></span></button>`;
    html += `<button type="button" class="field-action-btn delete-field" data-id="${field.id}" title="Delete field"><span class="dashicons dashicons-trash"></span></button>`;
    html += `</span></div><div class="field-preview">`;

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "tel":
      case "date":
        html += `<input type="${field.type}" placeholder="${
          field.placeholder || ""
        }" ${field.required ? "required" : ""} disabled>`;
        break;
      case "textarea":
        html += `<textarea placeholder="${field.placeholder || ""}" ${
          field.required ? "required" : ""
        } disabled rows="3"></textarea>`;
        break;
      case "select":
        html += `<select ${field.required ? "required" : ""} disabled>`;
        html += `<option value="">Select an option</option>`;
        field.options.forEach((option) => {
          html += `<option>${option}</option>`;
        });
        html += `</select>`;
        break;
      case "radio":
        html += `<div class="radio-options">`;
        field.options.forEach((option, i) => {
          html += `<label>`;
          html += `<input type="radio" name="${field.id}" value="${option}" ${
            field.required ? "required" : ""
          } disabled> `;
          html += `<span>${option}</span>`;
          html += `</label>`;
        });
        html += `</div>`;
        break;
      case "checkbox":
        html += `<div class="checkbox-options">`;
        field.options.forEach((option, i) => {
          html += `<label>`;
          html += `<input type="checkbox" value="${option}" ${
            field.required ? "required" : ""
          } disabled> `;
          html += `<span>${option}</span>`;
          html += `</label>`;
        });
        html += `</div>`;
        break;
    }

    html += `</div></div>`;
    return html;
  }

  function getFieldIcon(type) {
    const icons = {
      text: "editor-textcolor",
      email: "email",
      number: "editor-ol",
      tel: "phone",
      textarea: "text",
      select: "menu",
      radio: "marker",
      checkbox: "yes",
      date: "calendar",
    };
    return icons[type] || "admin-generic";
  }

  function selectField(fieldId) {
    $(".form-field").removeClass("selected");
    $(`#${fieldId}`).addClass("selected");
    selectedFieldId = fieldId;

    const field = formFields.find((f) => f.id === fieldId);
    if (field) {
      showFieldSettings(field);

      // Smooth scroll to settings panel
      $(".field-settings-panel")[0].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function showFieldSettings(field) {
    let settingsHtml = `
            <form id="fieldSettingsForm">
                <input type="hidden" name="field_id" value="${field.id}">
                <table class="avatar-form-table">
                    <tr>
                        <th><label>Field Type</label></th>
                        <td><strong>${field.type}</strong></td>
                    </tr>
                    <tr>
                        <th><label for="field_label">Label</label></th>
                        <td><input type="text" id="field_label" name="label" value="${
                          field.label
                        }" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="field_placeholder">Placeholder</label></th>
                        <td><input type="text" id="field_placeholder" name="placeholder" value="${
                          field.placeholder
                        }" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="field_required">Required</label></th>
                        <td><input type="checkbox" id="field_required" name="required" ${
                          field.required ? "checked" : ""
                        }></td>
                    </tr>
        `;

    if (["select", "radio", "checkbox"].includes(field.type)) {
      settingsHtml += `
                <tr>
                    <th><label>Options</label></th>
                    <td>
                        <div id="fieldOptions" style="margin-bottom:10px;">
            `;

      field.options.forEach((option, index) => {
        settingsHtml += `
                    <div class="option-row" style="display:flex;gap:10px;margin-bottom:5px;align-items:center;">
                        <input type="text" name="options[]" value="${option}" class="regular-text" style="flex:1;">
                        <button type="button" class="field-action-btn remove-option" ${
                          field.options.length <= 2 ? "disabled" : ""
                        } title="Remove option"><span class="dashicons dashicons-no"></span></button>
                    </div>
                `;
      });

      settingsHtml += `
                        </div>
                        <button type="button" class="button-gradient-secondary add-option">Add Option</button>
                    </td>
                </tr>
            `;
    }

    settingsHtml += `
                </table>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button type="button" class="button-gradient-primary update-field">Update Field</button>
                    <button type="button" class="button-gradient-secondary cancel-edit">Cancel</button>
                </div>
            </form>
        `;

    $("#fieldSettings").html(settingsHtml);
    $(".no-field-selected").hide();

    // Initialize option buttons
    $(".add-option").on("click", addOption);
    $(".remove-option").on("click", function () {
      if ($(this).prop("disabled")) return;
      $(this).closest(".option-row").remove();
    });
  }

  function addOption() {
    const html = `
            <div class="option-row" style="display:flex;gap:10px;margin-bottom:5px;align-items:center;">
                <input type="text" name="options[]" value="" class="regular-text" style="flex:1;">
                <button type="button" class="field-action-btn remove-option" title="Remove option"><span class="dashicons dashicons-no"></span></button>
            </div>
        `;
    $("#fieldOptions").append(html);

    // Rebind remove event
    $("#fieldOptions .remove-option:last").on("click", function () {
      $(this).closest(".option-row").remove();
    });
  }

  // Update field
  $(document).on("click", ".update-field", function () {
    const fieldId = $('#fieldSettingsForm input[name="field_id"]').val();
    const field = formFields.find((f) => f.id === fieldId);

    if (field) {
      field.label = $("#field_label").val();
      field.placeholder = $("#field_placeholder").val();
      field.required = $("#field_required").is(":checked");

      if (["select", "radio", "checkbox"].includes(field.type)) {
        const options = [];
        $('#fieldSettingsForm input[name="options[]"]').each(function () {
          const val = $(this).val().trim();
          if (val) options.push(val);
        });
        field.options = options.length > 0 ? options : ["Option 1"];
      }

      updateFormPreview();
      selectField(fieldId);

      // Show success message
      $(
        '<div class="notice notice-success" style="margin: 10px 0; padding: 10px;">Field updated successfully!</div>'
      )
        .insertAfter($("#fieldSettingsForm"))
        .delay(3000)
        .fadeOut(500, function () {
          $(this).remove();
        });
    }
  });

  $(document).on("click", ".cancel-edit", function () {
    if (selectedFieldId) {
      selectField(selectedFieldId);
    }
  });

  // Save field order
  function saveFieldOrder() {
    const newOrder = [];
    $("#previewForm .form-field").each(function (index) {
      const fieldId = $(this).attr("id");
      const field = formFields.find((f) => f.id === fieldId);
      if (field) {
        newOrder.push(field);
      }
    });
    formFields = newOrder;
  }

  function updateFieldCount() {
    $("#fieldCount").text("(" + formFields.length + " fields)");
  }

  // Save form
  $("#saveForm").on("click", function () {
    if (formFields.length === 0) {
      alert("Please add at least one field to the form.");
      return;
    }

    const formData = {
      title: formMeta.title,
      description: formMeta.description,
      fields: formFields,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    $.ajax({
      url: avatarFormBuilder.ajax_url,
      type: "POST",
      data: {
        action: "save_avatar_form",
        form_id: currentFormId,
        form_data: JSON.stringify(formData),
        nonce: avatarFormBuilder.save_form_nonce,
      },
      beforeSend: function () {
        $("#saveForm").prop("disabled", true).text("Saving...");
      },
      success: function (response) {
        if (response.success) {
          alert("Form saved successfully!");
          currentFormId = response.data.id;
          location.reload();
        } else {
          alert("Error saving form: " + response.data);
        }
      },
      error: function () {
        alert("Network error. Please try again.");
      },
      complete: function () {
        $("#saveForm").prop("disabled", false).text("Save Form");
      },
    });
  });

  function resetFormBuilder() {
    formFields = [];
    formMeta = {};
    currentFormId = null;
    selectedFieldId = null;
    $("#form_title").val("");
    $("#form_description").val("");
    $("#previewForm").empty();
    $("#fieldSettings").html(
      '<p class="no-field-selected">Select a field to edit its settings.</p>'
    );
    $("#noFieldsMessage").show();
    updateFieldCount();
  }
})(jQuery);
