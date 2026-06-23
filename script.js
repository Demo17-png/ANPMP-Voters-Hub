const ADMIN_PASSWORD = "demorols1721";

/* =========================
   INITIALIZE STORAGE
========================= */
function initializeStorage() {
  if (!localStorage.getItem("usedPasswords")) {
    localStorage.setItem("usedPasswords", JSON.stringify([]));
  }

  if (!localStorage.getItem("votes")) {
    localStorage.setItem(
      "votes",
      JSON.stringify({
        president: {
          "Adeolu Thomas": 0,
          "Seun Babatunde": 0
        },
        vicePresident: {
          "Kemi Jaja": 0,
          "Bola Kunmbi": 0
        },
        secretary: {
          "Bode Idowu": 0,
          "Johnson Dada": 0
        }
      })
    );
  }
}

initializeStorage();

/* =========================
   NAVIGATION
========================= */
function goToAdmin() {
  window.location.href = "admin-login.html";
}

function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "index.html";
}

/* =========================
   VOTER LOGIN
========================= */
const voterLoginForm = document.getElementById("voterLoginForm");
if (voterLoginForm) {
  voterLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const passwordInput = document.getElementById("voterPassword");
    const message = document.getElementById("loginMessage");
    const enteredPassword = passwordInput.value.trim();

    const usedPasswords = JSON.parse(localStorage.getItem("usedPasswords")) || [];

    if (!enteredPassword) {
      message.textContent = "Please enter your voting password.";
      message.className = "message error";
      return;
    }

    if (!voterPasswords.includes(enteredPassword)) {
      message.textContent = "Invalid voting password.";
      message.className = "message error";
      return;
    }

    if (usedPasswords.includes(enteredPassword)) {
      message.textContent = "This password has already been used to vote.";
      message.className = "message error";
      return;
    }

    sessionStorage.setItem("currentVoterPassword", enteredPassword);
    window.location.href = "vote.html";
  });
}

/* =========================
   VOTE SUBMISSION
========================= */
const voteForm = document.getElementById("voteForm");
if (voteForm) {
  // ensure only logged in voters can access page
  const currentVoterPassword = sessionStorage.getItem("currentVoterPassword");
  if (!currentVoterPassword) {
    window.location.href = "index.html";
  }

  voteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPassword = sessionStorage.getItem("currentVoterPassword");
    const usedPasswords = JSON.parse(localStorage.getItem("usedPasswords")) || [];
    const votes = JSON.parse(localStorage.getItem("votes"));

    if (!currentPassword) {
      alert("Unauthorized access. Please log in again.");
      window.location.href = "index.html";
      return;
    }

    if (usedPasswords.includes(currentPassword)) {
      alert("This voter has already voted.");
      window.location.href = "index.html";
      return;
    }

    const president = document.querySelector('input[name="president"]:checked');
    const vicePresident = document.querySelector('input[name="vicePresident"]:checked');
    const secretary = document.querySelector('input[name="secretary"]:checked');

    if (!president || !vicePresident || !secretary) {
      alert("Please vote for one candidate in each position.");
      return;
    }

    // add votes
    votes.president[president.value]++;
    votes.vicePresident[vicePresident.value]++;
    votes.secretary[secretary.value]++;

    // mark password as used
    usedPasswords.push(currentPassword);

    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("usedPasswords", JSON.stringify(usedPasswords));

    sessionStorage.removeItem("currentVoterPassword");

    const voteMessage = document.getElementById("voteMessage");
    voteMessage.textContent = "Vote submitted successfully!";
    voteMessage.className = "message success";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  });
}

/* =========================
   ADMIN LOGIN
========================= */
const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const password = document.getElementById("adminPassword").value.trim();
    const message = document.getElementById("adminLoginMessage");

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "admin-dashboard.html";
    } else {
      message.textContent = "Incorrect admin password.";
      message.className = "message error";
    }
  });
}

/* =========================
   LOAD ADMIN DASHBOARD
========================= */
function loadDashboard() {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!document.getElementById("presidentAdeolu")) return;

  if (isAdminLoggedIn !== "true") {
    window.location.href = "admin-login.html";
    return;
  }

  const votes = JSON.parse(localStorage.getItem("votes"));

  document.getElementById("presidentAdeolu").textContent = votes.president["Adeolu Thomas"];
  document.getElementById("presidentSeun").textContent = votes.president["Seun Babatunde"];

  document.getElementById("vpKemi").textContent = votes.vicePresident["Kemi Jaja"];
  document.getElementById("vpBola").textContent = votes.vicePresident["Bola Kunmbi"];

  document.getElementById("secBode").textContent = votes.secretary["Bode Idowu"];
  document.getElementById("secJohnson").textContent = votes.secretary["Johnson Dada"];
}

loadDashboard();

/* =========================
   RESET ELECTION (DEMO ONLY)
========================= */
function resetElection() {
  const confirmReset = confirm("Are you sure you want to reset all votes?");
  if (!confirmReset) return;

  localStorage.setItem("usedPasswords", JSON.stringify([]));
  localStorage.setItem(
    "votes",
    JSON.stringify({
      president: {
        "Adeolu Thomas": 0,
        "Seun Babatunde": 0
      },
      vicePresident: {
        "Kemi Jaja": 0,
        "Bola Kunmbi": 0
      },
      secretary: {
        "Bode Idowu": 0,
        "Johnson Dada": 0
      }
    })
  );

  loadDashboard();
  alert("All votes have been reset.");
}