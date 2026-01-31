# LocalStorage Todo (Sample Project)

A small sample Todo app built with plain HTML, CSS and JavaScript that stores todos in `localStorage` so they persist between page reloads.

Features:
- Add todos
- Edit (double-click or press the edit button)
- Toggle complete / active
- Delete
- Filter (All / Active / Completed)
- Clear completed
- Uses `localStorage` (key: `todos:v1`)

How to run:
1. Save the four files (index.html, styles.css, script.js, README.md) in one folder.
2. Open `index.html` in your browser.
3. Start adding todos — they will be saved in your browser's localStorage.

Notes:
- Data is stored only in the browser where you run the app (no server).
- To reset data, open browser devtools -> Application -> Local Storage -> delete the `todos:v1` key or use the "Clear completed" button and then delete remaining items.

You can extend this project by:
- Adding due dates or priorities
- Persisting to a backend (if you want cross-device sync)
- Adding drag-and-drop ordering