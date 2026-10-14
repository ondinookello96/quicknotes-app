// ---------- 1. Select Elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes_app_data";

// ---------- 2. Data State & LocalStorage ----------
let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ---------- 3. Render Function ----------
function render() {
  notesList.innerHTML = "";

  // Update total note count message
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  // Filter notes based on search input (case-insensitive)
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  // If search yields no results and user is actively typing a search query
  if (filteredNotes.length === 0 && searchTerm !== "") {
    const li = document.createElement("li");
    li.textContent = "No notes match your search.";
    li.style.padding = "16px";
    li.style.color = "#6b7280";
    li.style.textAlign = "center";
    notesList.appendChild(li);
    return;
  }

  filteredNotes.forEach((note) => {
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

// ---------- 4. Add, Delete & Validation Functions ----------
function addNote(text, category) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    showError("Please type a note first.");
    return false;
  }

  if (trimmedText.length > 200) {
    showError("Notes must be 200 characters or fewer.");
    return false;
  }

  clearError();

  const newNote = {
    id: Date.now(),
    text: trimmedText,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotes();
  render();
  return true;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

// ---------- 5. Event Listeners ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const text = input.value;
  const category = categorySelect.value;

  const success = addNote(text, category);

  if (success) {
    input.value = "";
    input.focus();
  }
});

// Live search filtering listener
searchInput.addEventListener("input", () => {
  render();
});

// Initial render on page load
render();