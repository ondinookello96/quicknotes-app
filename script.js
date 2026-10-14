// ---------- 1. Select Elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// ---------- 2. Data State ----------
let notes = [];

// ---------- 3. Render Function ----------
function render() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note-card", `category-${note.category}`);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("note-content");

    const textP = document.createElement("p");
    textP.classList.add("note-text");
    textP.textContent = note.text; // Safe for user text

    const metaDiv = document.createElement("div");
    metaDiv.classList.add("note-meta");

    const badgeSpan = document.createElement("span");
    badgeSpan.classList.add("category-badge");
    badgeSpan.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(badgeSpan);
    metaDiv.appendChild(dateSpan);

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
}

// ---------- 4. Add & Delete Functions ----------
function addNote(text, category) {
  const newNote = {
    id: Date.now(),
    text: text.trim(),
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  render();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  render();
}

// ---------- 5. Form Submit Listener ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const text = input.value;
  const category = categorySelect.value;

  if (text.trim() === "") return; // Basic guard for now

  addNote(text, category);

  input.value = "";
  input.focus();
});

// Initial render
render();