(function() {
  const STORAGE_KEY = 'ochigram_docs_store';

  function getSavedDocs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveDocsToStorage(docs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }

  const TEMPLATES = [
    {
      id: 'blank',
      title: 'Blank Document',
      icon: 'file',
      content: ''
    },
    {
      id: 'resume',
      title: 'Resume Template',
      icon: 'user-check',
      content: '<h2>Your Name</h2><p><strong>Email:</strong> email@example.com | <strong>Phone:</strong> +880 123456789</p><hr><h3 style="color:#2563eb;">Professional Summary</h3><p>A passionate developer dedicated to creating innovative solutions...</p><h3 style="color:#2563eb;">Experience</h3><p><strong>Software Engineer</strong> - Tech Corp (2024 - Present)</p><ul><li>Developed high performance web software.</li></ul>'
    },
    {
      id: 'meeting',
      title: 'Meeting Notes',
      icon: 'calendar',
      content: '<h2>Meeting Notes</h2><p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p><p><strong>Attendees:</strong> Person A, Person B</p><hr><h3 style="color:#2563eb;">Agenda</h3><ol><li>Project Review</li><li>Next Steps</li></ol><h3 style="color:#2563eb;">Action Items</h3><ul><li>[ ] Task 1</li><li>[ ] Task 2</li></ul>'
    },
    {
      id: 'article',
      title: 'Article Outline',
      icon: 'book-open',
      content: '<h1>Article Title</h1><p><em>Short summary of the article...</em></p><hr><h2>Introduction</h2><p>Write introduction here...</p><h2>Main Content</h2><p>Detail your topics...</p><h2>Conclusion</h2><p>Wrap up your thoughts...</p>'
    }
  ];

  return {
    render: function(container, tabId) {
      let docs = getSavedDocs();
      let currentDocId = null;

      container.innerHTML = 
        '<style>' +
        '.gdocs-wrapper { display: flex; flex-direction: column; height: 100%; background-color: var(--bg-editor); color: var(--text-active); box-sizing: border-box; }' +
        '.gdocs-dashboard { flex: 1; padding: 24px; overflow-y: auto; }' +
        '.gdocs-section-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--text-main); display: flex; align-items: center; gap: 8px; }' +
        '.gdocs-templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 30px; }' +
        '.gdocs-tpl-card { background-color: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s ease; height: 110px; }' +
        '.gdocs-tpl-card:hover { border-color: var(--accent-color); transform: translateY(-2px); }' +
        '.gdocs-tpl-icon { width: 36px; height: 36px; background-color: var(--input-bg); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-color); }' +
        '.gdocs-list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }' +
        '.gdocs-doc-card { background-color: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; height: 110px; cursor: pointer; position: relative; transition: border-color 0.2s; }' +
        '.gdocs-doc-card:hover { border-color: var(--accent-color); }' +
        '.gdocs-doc-card-title { font-size: 14px; font-weight: 500; color: var(--text-active); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; }' +
        '.gdocs-doc-card-date { font-size: 11px; color: var(--text-muted); }' +
        '.gdocs-doc-card-actions { display: flex; justify-content: flex-end; gap: 8px; }' +
        '.gdocs-doc-btn-icon { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 4px; }' +
        '.gdocs-doc-btn-icon:hover { color: #ef4444; background-color: rgba(239, 68, 68, 0.1); }' +
        '.gdocs-editor-container { display: none; flex-direction: column; height: 100%; }' +
        '.gdocs-editor-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border-color); background-color: var(--bg-sidebar); gap: 12px; }' +
        '.gdocs-header-left { display: flex; align-items: center; gap: 12px; flex: 1; }' +
        '.gdocs-back-btn { background: transparent; border: 1px solid var(--card-border); color: var(--text-main); padding: 6px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; }' +
        '.gdocs-back-btn:hover { background-color: var(--card-bg); color: var(--text-active); }' +
        '.gdocs-title-input { background: transparent; border: 1px solid transparent; color: var(--text-active); font-size: 16px; font-weight: 600; padding: 4px 8px; border-radius: 4px; outline: none; max-width: 300px; }' +
        '.gdocs-title-input:hover, .gdocs-title-input:focus { border-color: var(--card-border); background-color: var(--input-bg); }' +
        '.gdocs-toolbar { display: flex; align-items: center; gap: 4px; padding: 8px 16px; background-color: var(--bg-activity); border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }' +
        '.gdocs-tool-btn { background: transparent; border: none; color: var(--text-main); width: 30px; height: 30px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }' +
        '.gdocs-tool-btn:hover { background-color: var(--card-bg); color: var(--text-active); }' +
        '.gdocs-tool-select { background-color: var(--input-bg); border: 1px solid var(--card-border); color: var(--text-main); padding: 4px 8px; border-radius: 4px; font-size: 12px; outline: none; cursor: pointer; }' +
        '.gdocs-tool-divider { width: 1px; height: 18px; background-color: var(--border-color); margin: 0 4px; }' +
        '.gdocs-paper-wrapper { flex: 1; padding: 30px; overflow-y: auto; display: flex; justify-content: center; background-color: var(--bg-editor); }' +
        '.gdocs-paper { width: 100%; max-width: 800px; min-height: 900px; background-color: #ffffff; color: #111827; padding: 50px 60px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); outline: none; line-height: 1.6; font-size: 15px; }' +
        '[data-theme="light"] .gdocs-paper { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }' +
        '</style>' +
        '<div class="gdocs-wrapper">' +
          '<div class="gdocs-dashboard" id="gdocs-dash-' + tabId + '">' +
            '<div class="gdocs-section-title"><i data-lucide="plus-circle" style="width:16px; height:16px;"></i> Start a new document</div>' +
            '<div class="gdocs-templates-grid" id="gdocs-tpl-grid-' + tabId + '"></div>' +
            '<div class="gdocs-section-title"><i data-lucide="clock" style="width:16px; height:16px;"></i> Recent documents</div>' +
            '<div class="gdocs-list-grid" id="gdocs-list-' + tabId + '"></div>' +
          '</div>' +
          '<div class="gdocs-editor-container" id="gdocs-editor-box-' + tabId + '">' +
            '<div class="gdocs-editor-header">' +
              '<div class="gdocs-header-left">' +
                '<button class="gdocs-back-btn" id="gdocs-back-btn-' + tabId + '"><i data-lucide="arrow-left" style="width:14px; height:14px;"></i> Back</button>' +
                '<input type="text" class="gdocs-title-input" id="gdocs-doc-title-' + tabId + '" placeholder="Untitled Document">' +
              '</div>' +
              '<span style="font-size:12px; color:var(--text-muted);" id="gdocs-save-status-' + tabId + '">Auto-saved</span>' +
            '</div>' +
            '<div class="gdocs-toolbar">' +
              '<select class="gdocs-tool-select" id="gdocs-format-select-' + tabId + '">' +
                '<option value="P">Normal text</option>' +
                '<option value="H1">Heading 1</option>' +
                '<option value="H2">Heading 2</option>' +
                '<option value="H3">Heading 3</option>' +
              '</select>' +
              '<div class="gdocs-tool-divider"></div>' +
              '<button class="gdocs-tool-btn" data-cmd="bold" title="Bold"><i data-lucide="bold" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="italic" title="Italic"><i data-lucide="italic" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="underline" title="Underline"><i data-lucide="underline" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="strikeThrough" title="Strikethrough"><i data-lucide="strikethrough" style="width:14px; height:14px;"></i></button>' +
              '<div class="gdocs-tool-divider"></div>' +
              '<button class="gdocs-tool-btn" data-cmd="justifyLeft" title="Align Left"><i data-lucide="align-left" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="justifyCenter" title="Align Center"><i data-lucide="align-center" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="justifyRight" title="Align Right"><i data-lucide="align-right" style="width:14px; height:14px;"></i></button>' +
              '<div class="gdocs-tool-divider"></div>' +
              '<button class="gdocs-tool-btn" data-cmd="insertUnorderedList" title="Bullet List"><i data-lucide="list" style="width:14px; height:14px;"></i></button>' +
              '<button class="gdocs-tool-btn" data-cmd="insertOrderedList" title="Numbered List"><i data-lucide="list-ordered" style="width:14px; height:14px;"></i></button>' +
              '<div class="gdocs-tool-divider"></div>' +
              '<button class="gdocs-tool-btn" data-cmd="removeFormat" title="Clear Formatting"><i data-lucide="remove-formatting" style="width:14px; height:14px;"></i></button>' +
            '</div>' +
            '<div class="gdocs-paper-wrapper">' +
              '<div class="gdocs-paper" id="gdocs-editor-' + tabId + '" contenteditable="true"></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      const dashEl = container.querySelector('#gdocs-dash-' + tabId);
      const editorBoxEl = container.querySelector('#gdocs-editor-box-' + tabId);
      const listEl = container.querySelector('#gdocs-list-' + tabId);
      const tplGridEl = container.querySelector('#gdocs-tpl-grid-' + tabId);
      const titleInput = container.querySelector('#gdocs-doc-title-' + tabId);
      const editor = container.querySelector('#gdocs-editor-' + tabId);

      // Render Templates
      tplGridEl.innerHTML = TEMPLATES.map(tpl => 
        '<div class="gdocs-tpl-card" data-tpl-id="' + tpl.id + '">' +
          '<div class="gdocs-tpl-icon"><i data-lucide="' + tpl.icon + '"></i></div>' +
          '<span style="font-size:13px; font-weight:500;">' + tpl.title + '</span>' +
        '</div>'
      ).join('');

      tplGridEl.querySelectorAll('.gdocs-tpl-card').forEach(card => {
        card.addEventListener('click', () => {
          window['gdocs_' + tabId].createDoc(card.getAttribute('data-tpl-id'));
        });
      });

      function renderRecentList() {
        if (docs.length === 0) {
          listEl.innerHTML = '<p style="font-size:13px; color:var(--text-muted); grid-column:1/-1;">No documents found. Create one above!</p>';
          return;
        }

        listEl.innerHTML = docs.map(d => 
          '<div class="gdocs-doc-card" data-doc-id="' + d.id + '">' +
            '<div>' +
              '<div class="gdocs-doc-card-title">' + d.title + '</div>' +
              '<div class="gdocs-doc-card-date">' + new Date(d.updatedAt).toLocaleDateString() + '</div>' +
            '</div>' +
            '<div class="gdocs-doc-card-actions">' +
              '<button class="gdocs-doc-btn-icon" data-del-id="' + d.id + '" title="Delete"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></button>' +
            '</div>' +
          '</div>'
        ).join('');

        listEl.querySelectorAll('.gdocs-doc-card').forEach(card => {
          card.addEventListener('click', () => {
            window['gdocs_' + tabId].openDoc(card.getAttribute('data-doc-id'));
          });
        });

        listEl.querySelectorAll('.gdocs-doc-btn-icon').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window['gdocs_' + tabId].deleteDoc(btn.getAttribute('data-del-id'));
          });
        });

        lucide.createIcons();
      }

      function updateDocData() {
        if (!currentDocId) return;
        const target = docs.find(d => d.id === currentDocId);
        if (target) {
          target.title = titleInput.value || 'Untitled Document';
          target.content = editor.innerHTML;
          target.updatedAt = new Date().toISOString();
          saveDocsToStorage(docs);
        }
      }

      titleInput.addEventListener('input', updateDocData);
      editor.addEventListener('input', updateDocData);

      container.querySelector('#gdocs-back-btn-' + tabId).addEventListener('click', () => {
        window['gdocs_' + tabId].closeEditor();
      });

      container.querySelector('#gdocs-format-select-' + tabId).addEventListener('change', (e) => {
        window['gdocs_' + tabId].execCmd('formatBlock', e.target.value);
      });

      container.querySelectorAll('.gdocs-tool-btn[data-cmd]').forEach(btn => {
        btn.addEventListener('click', () => {
          window['gdocs_' + tabId].execCmd(btn.getAttribute('data-cmd'));
        });
      });

      window['gdocs_' + tabId] = {
        createDoc: function(templateId) {
          const tpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
          const newDoc = {
            id: 'doc_' + Date.now(),
            title: tpl.id === 'blank' ? 'Untitled Document' : tpl.title,
            content: tpl.content,
            updatedAt: new Date().toISOString()
          };
          docs.unshift(newDoc);
          saveDocsToStorage(docs);
          this.openDoc(newDoc.id);
        },

        openDoc: function(docId) {
          const doc = docs.find(d => d.id === docId);
          if (!doc) return;
          currentDocId = docId;
          titleInput.value = doc.title;
          editor.innerHTML = doc.content;

          dashEl.style.display = 'none';
          editorBoxEl.style.display = 'flex';
          lucide.createIcons();
        },

        closeEditor: function() {
          currentDocId = null;
          editorBoxEl.style.display = 'none';
          dashEl.style.display = 'block';
          renderRecentList();
        },

        deleteDoc: function(docId) {
          docs = docs.filter(d => d.id !== docId);
          saveDocsToStorage(docs);
          renderRecentList();
        },

        execCmd: function(command, value = null) {
          document.execCommand(command, false, value);
          updateDocData();
        }
      };

      renderRecentList();
      lucide.createIcons();
    }
  };
})();
