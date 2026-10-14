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

  // Update count message correctly based on project requirements
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

// ---------- 4. Add, Delete & Validation Functions ----------
function addNote(text, category) {
  const trimmedText = text.trim();

  // Validation: Check if empty or only spaces
  if (trimmedText === "") {
    showError("Please type a note first.");
    return false;
  }

  // Validation: Check character length limit (over 200 characters)
  if (trimmedText.length > 200) {
    showError("Notes must be 200 characters or fewer.");
    return false;
  }

  // Clear any existing error messages on successful validation
  clearError();

  const newNote = {
    id: Date.now(),
    text: trimmedText,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  render();
  return true;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  render();
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

// ---------- 5. Form Submit Listener ----------
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

// Initial render
render();