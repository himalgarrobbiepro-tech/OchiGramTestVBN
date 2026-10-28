(function () {
  return {
    render: function (container) {
      container.innerHTML = `
        <div class="workspace-tool">
          <h3><i data-lucide="type"></i> Word & Character Counter</h3>
          <textarea class="tool-input" id="wc-input" placeholder="Type or paste your text here..."></textarea>
          <div class="stats-container">
            <div class="stat-badge">Words: <span id="val-words">0</span></div>
            <div class="stat-badge">Characters: <span id="val-chars">0</span></div>
            <div class="stat-badge">Reading Time: <span id="val-time">0m</span></div>
          </div>
        </div>
      `;

      const input = container.querySelector('#wc-input');
      input.addEventListener('input', () => {
        const text = input.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        const readingTime = Math.ceil(words / 200);

        container.querySelector('#val-words').innerText = words;
        container.querySelector('#val-chars').innerText = chars;
        container.querySelector('#val-time').innerText = `${readingTime}m`;
      });

      if (window.lucide) lucide.createIcons();
    }
  };
})();