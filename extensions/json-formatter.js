(function () {
  return {
    render: function (container) {
      container.innerHTML = `
        <div class="workspace-tool">
          <h3><i data-lucide="file-code"></i> JSON Formatter</h3>
          <textarea class="tool-input" id="json-input" placeholder="Paste unformatted JSON here..."></textarea>
          <button class="btn-primary" id="btn-format-json" style="margin-bottom:15px;">Format JSON</button>
          <textarea class="tool-input" id="json-output" placeholder="Formatted output will appear here..." readonly></textarea>
        </div>
      `;

      const btn = container.querySelector('#btn-format-json');
      btn.addEventListener('click', () => {
        const input = container.querySelector('#json-input').value;
        const output = container.querySelector('#json-output');
        try {
          const parsed = JSON.parse(input);
          output.value = JSON.stringify(parsed, null, 2);
        } catch (e) {
          output.value = "Invalid JSON: " + e.message;
        }
      });

      if (window.lucide) lucide.createIcons();
    }
  };
})();