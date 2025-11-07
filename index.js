const starContainer = document.getElementById("starRating");
const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const avgStars = document.getElementById("avgStars");
const avgValue = document.getElementById("avgValue");
const ratingProgress = document.getElementById("ratingProgress");

let selectedRating = 0;


for (let i = 1; i <= 5; i++) {
  const star = document.createElement("span");
  star.classList.add("star");
  star.innerHTML = "&#9733;";
  star.dataset.value = i;
  star.addEventListener("click", () => selectRating(i));
  starContainer.appendChild(star);
}

function selectRating(value) {
  selectedRating = value;
  document.querySelectorAll(".star").forEach((star, index) => {
    star.classList.toggle("selected", index < value);
  });
}

feedbackForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const department = document.getElementById("department").value;
  const comments = document.getElementById("comments").value.trim();

  if (!name || selectedRating === 0) {
    alert("Please enter your name and select a rating.");
    return;
  }

  const feedback = { name, department, rating: selectedRating, comments };
  saveFeedback(feedback);
  feedbackForm.reset();
  selectedRating = 0;
  document.querySelectorAll(".star").forEach(star => star.classList.remove("selected"));
  loadFeedbacks();
});


function saveFeedback(feedback) {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}


function loadFeedbacks() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbackList.innerHTML = "";

  if (feedbacks.length === 0) {
    feedbackList.innerHTML = "<p class='text-center text-muted'>No feedback yet.</p>";
    avgStars.innerHTML = "";
    avgValue.textContent = "N/A";
    ratingProgress.style.width = "0%";
    return;
  }

  let totalRating = 0;
  feedbacks.forEach((fb) => {
    totalRating += fb.rating;

    const card = document.createElement("div");
    card.classList.add("col-md-4");
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${fb.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${fb.department || "N/A"}</h6>
          <p>${"★".repeat(fb.rating)}${"☆".repeat(5 - fb.rating)}</p>
          <p class="card-text">${fb.comments || ""}</p>
        </div>
      </div>`;
    feedbackList.appendChild(card);
  });

  const avgRating = (totalRating / feedbacks.length).toFixed(1);
  updateAverageDisplay(avgRating);
}

function updateAverageDisplay(avg) {
  avgStars.innerHTML = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
  avgValue.textContent = `${avg} / 5`;
  ratingProgress.style.width = `${(avg / 5) * 100}%`;
}

window.addEventListener("load", loadFeedbacks);
