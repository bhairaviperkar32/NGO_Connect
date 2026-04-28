console.log("JS Loaded");
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let role = "volunteer";

/* ========== CHECK FIREBASE ========== */
console.log("Auth object:", auth);
if (!auth) {
  console.error("Firebase auth is NOT initialized properly ❌");
}

/* ========== INITIALIZE ON DOM READY ========== */
document.addEventListener("DOMContentLoaded", () => {
  initializeRoleTabs();
  loadDashboard();
  setupLogout();
});

/* ========== INITIALIZE ROLE TABS ========== */
function initializeRoleTabs() {
  const volunteerTab = document.getElementById("volunteerTab");
  const ngoTab = document.getElementById("ngoTab");

  if (volunteerTab) {
    volunteerTab.addEventListener("change", () => {
      role = "volunteer";
      updateFormVisibility();
    });
  }

  if (ngoTab) {
    ngoTab.addEventListener("change", () => {
      role = "ngo";
      updateFormVisibility();
    });
  }
}

/* ========== UPDATE FORM VISIBILITY ========== */
function updateFormVisibility() {
  const volForm = document.getElementById("volunteerForm");
  const ngoForm = document.getElementById("ngoForm");

  if (volForm && ngoForm) {
    if (role === "volunteer") {
      volForm.classList.remove("hidden");
      ngoForm.classList.add("hidden");
    } else {
      ngoForm.classList.remove("hidden");
      volForm.classList.add("hidden");
    }
  }
}

/* ========== REGISTER VOLUNTEER ========== */
window.registerVolunteer = function () {
  const email = document.getElementById("volEmail")?.value;
  const password = document.getElementById("volPassword")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  console.log("Register Volunteer:", email);

  createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      const userData = {
        email: email,
        uid: res.user.uid,
        role: "volunteer"
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      alert("Volunteer Registered Successfully ✅");
      window.location.href = "login.html";
    })
    .catch((err) => {
      console.error("Register Volunteer Error:", err);
      alert("Error: " + err.message);
    });
};

/* ========== REGISTER NGO ========== */
window.registerNGO = function () {
  const email = document.getElementById("ngoEmail")?.value;
  const password = document.getElementById("ngoPassword")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  console.log("Register NGO:", email);

  createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      const userData = {
        email: email,
        uid: res.user.uid,
        role: "ngo"
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      alert("NGO Registered Successfully ✅");
      window.location.href = "login.html";
    })
    .catch((err) => {
      console.error("Register NGO Error:", err);
      alert("Error: " + err.message);
    });
};

/* ========== LOGIN ========== */
window.login = function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  console.log("Login attempt:", email);

  signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      const existingUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      
      const userData = {
        email: res.user.email,
        uid: res.user.uid,
        role: existingUser.role || "volunteer"
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      alert("Login Successful ✅");
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      console.error("Login Error:", err);
      alert("Login Error: " + err.message);
    });
};

/* ========== GET URGENCY COLOR ========== */
function getUrgencyColor(urgency) {
  const level = urgency.toLowerCase();
  if (level === "high") return "red";
  if (level === "medium") return "orange";
  if (level === "low") return "green";
  return "gray";
}

/* ========== RENDER NGO REQUEST CARDS ========== */
function renderNGORequests() {
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  
  let html = `
    <div class="dashboard-section">
      <h2>All NGO Requests</h2>
      <div class="requests-container">
  `;
  
  if (requests.length === 0) {
    html += `<p style="color: #666; font-size: 18px;">No requests available yet</p>`;
  } else {
    requests.forEach((request, index) => {
      const urgencyColor = getUrgencyColor(request.urgency);
      html += `
        <div class="request-card" style="border-left: 5px solid ${urgencyColor}; padding: 15px; margin: 10px 0; background: #f9f9f9; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0;">${request.title}</h4>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${request.category}</p>
          <p style="margin: 5px 0;"><strong>Subcategory:</strong> ${request.subcategory || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Description:</strong> ${request.description}</p>
          <p style="margin: 5px 0;">
            <strong>Urgency:</strong> 
            <span style="color: ${urgencyColor}; font-weight: bold; text-transform: uppercase;">${request.urgency}</span>
          </p>
          <button class="btn-primary" onclick="applyToRequest(${index})" style="margin-top: 10px;">Apply</button>
        </div>
      `;
    });
  }
  
  html += `</div></div>`;
  return html;
}

/* ========== RENDER APPLIED REQUESTS ========== */
function renderAppliedRequests() {
  const appliedRequests = JSON.parse(localStorage.getItem("appliedRequests")) || [];
  
  let html = `
    <div class="dashboard-section">
      <h2>Your Applied Requests</h2>
      <div class="applied-container">
  `;
  
  if (appliedRequests.length === 0) {
    html += `<p style="color: #666; font-size: 18px;">You haven't applied to any requests yet</p>`;
  } else {
    appliedRequests.forEach((request, index) => {
      const urgencyColor = getUrgencyColor(request.urgency);
      html += `
        <div class="applied-card" style="border-left: 5px solid ${urgencyColor}; padding: 15px; margin: 10px 0; background: #e8f5e9; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0;">${request.title}</h4>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${request.category}</p>
          <p style="margin: 5px 0;">
            <strong>Urgency:</strong> 
            <span style="color: ${urgencyColor}; font-weight: bold; text-transform: uppercase;">${request.urgency}</span>
          </p>
          <p style="margin: 5px 0; font-size: 12px; color: #999;">Applied on: ${request.appliedDate || 'N/A'}</p>
          <button class="btn-primary" onclick="removeAppliedRequest(${index})" style="margin-top: 10px; background: #ff6b6b;">Remove</button>
        </div>
      `;
    });
  }
  
  html += `</div></div>`;
  return html;
}

/* ========== LOAD DASHBOARD ========== */
function loadDashboard() {
  const dashboardContent = document.getElementById("dashboardContent");

  if (!dashboardContent) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRole = user.role || "volunteer";

  if (userRole === "ngo") {
    dashboardContent.innerHTML = `
      <div class="dashboard-section">
        <h2>Welcome NGO</h2>
        <p><strong>Email:</strong> ${user.email}</p>

        <h3>Post Help Request</h3>
        <div class="form-group">
          <input id="ngoTitle" placeholder="Request Title" type="text"><br><br>
          <input id="ngoCategory" placeholder="Category (e.g., Food, Blood, Teaching)" type="text"><br><br>
          <input id="ngoSubcategory" placeholder="Subcategory (optional)" type="text"><br><br>
          <textarea id="ngoDescription" placeholder="Description" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea><br><br>
          <select id="ngoUrgency" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="">Select Urgency Level</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select><br><br>
          <button class="btn-primary" onclick="postRequest()">Post Request</button>
        </div>
      </div>
    `;
  } else {
    dashboardContent.innerHTML = `
      <div class="dashboard-section">
        <h2>Welcome Volunteer</h2>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>
      ${renderNGORequests()}
      ${renderAppliedRequests()}
    `;
  }
}

/* ========== POST REQUEST ========== */
window.postRequest = function () {
  const title = document.getElementById("ngoTitle")?.value;
  const category = document.getElementById("ngoCategory")?.value;
  const subcategory = document.getElementById("ngoSubcategory")?.value;
  const description = document.getElementById("ngoDescription")?.value;
  const urgency = document.getElementById("ngoUrgency")?.value;

  if (!title || !category || !urgency) {
    alert("Please fill required fields (Title, Category, Urgency)");
    return;
  }

  const newRequest = {
    title: title,
    category: category,
    subcategory: subcategory || "",
    description: description || "",
    urgency: urgency,
    createdDate: new Date().toLocaleString()
  };

  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  requests.push(newRequest);
  localStorage.setItem("requests", JSON.stringify(requests));

  alert("Request Posted Successfully ✅");

  document.getElementById("ngoTitle").value = "";
  document.getElementById("ngoCategory").value = "";
  document.getElementById("ngoSubcategory").value = "";
  document.getElementById("ngoDescription").value = "";
  document.getElementById("ngoUrgency").value = "";
};

/* ========== APPLY TO REQUEST ========== */
window.applyToRequest = function (index) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  
  if (!user) {
    alert("Please log in first");
    return;
  }

  if (!requests[index]) {
    alert("Request not found");
    return;
  }

  const request = requests[index];
  const appliedRequests = JSON.parse(localStorage.getItem("appliedRequests")) || [];

  const alreadyApplied = appliedRequests.some(r => 
    r.title === request.title && r.category === request.category
  );

  if (alreadyApplied) {
    alert("You have already applied to this request");
    return;
  }

  const appliedRequest = {
    ...request,
    appliedDate: new Date().toLocaleString(),
    volunteerEmail: user.email
  };

  appliedRequests.push(appliedRequest);
  localStorage.setItem("appliedRequests", JSON.stringify(appliedRequests));

  alert("Successfully applied to request ✅");
  
  loadDashboard();
};

/* ========== REMOVE APPLIED REQUEST ========== */
window.removeAppliedRequest = function (index) {
  const appliedRequests = JSON.parse(localStorage.getItem("appliedRequests")) || [];

  if (appliedRequests[index]) {
    appliedRequests.splice(index, 1);
    localStorage.setItem("appliedRequests", JSON.stringify(appliedRequests));
    alert("Application removed ✅");
    loadDashboard();
  }
};

/* ========== SETUP LOGOUT ========== */
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      alert("Logged out successfully");
      window.location.href = "login.html";
    });
  }
}