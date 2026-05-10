const API_URL = "http://localhost:8000/api/admins";

async function loadAdmins() {
  const res = await fetch(API_URL);
  const admins = await res.json();
  const tbody = document.querySelector("#adminsTable tbody");
  tbody.innerHTML = "";
  admins.forEach(a => {
    tbody.innerHTML += `<tr>
      <td>${a.username}</td>
      <td>${a.role}</td>
    </tr>`;
  });
}

document.getElementById("adminForm").addEventListener("submit", async e => {
  e.preventDefault();
  const admin = {
    username: document.getElementById("adminUser").value,
    password: document.getElementById("adminPass").value,
    role: "staff"
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(admin)
  });
  e.target.reset();
  loadAdmins();
});

loadAdmins();
