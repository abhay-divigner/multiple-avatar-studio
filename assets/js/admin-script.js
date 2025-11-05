jQuery(document).ready(function ($) {
  // Initialize the color picker
  $('.color-field').wpColorPicker();
});

document.querySelectorAll('.copy-shortcode-btn').forEach(button => {
  button.addEventListener('click', function () {
    const wrap = this.closest('.shortcode-copy-wrap'); // Finds the wrapper div
    const shortcodeEl = wrap.querySelector('.shortcode-text'); // Finds the <code> with shortcode
    const text = shortcodeEl?.innerText || ''; // Grabs the shortcode text safely

    navigator.clipboard.writeText(text).then(() => {
      this.innerText = 'Copied!';
      setTimeout(() => {
        this.innerText = 'Copy';
      }, 1500);
    }).catch(() => {
      alert('Failed to copy');
    });
  });
});
