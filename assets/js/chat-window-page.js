jQuery(document).ready(function ($) {
  const $pagesSelect = $("#chat_window_pages");

  if ($pagesSelect.length) {
    $pagesSelect.select2({
      placeholder: "Select pages for chat widget...",
      allowClear: true,
      width: "100%",
    });
  }
});
