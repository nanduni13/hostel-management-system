const API_URL = "http://localhost:8000/api/students";

async function loadStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    tbody.innerHTML += `<tr>
      <td>${s.name}</td>
      <td>${s.age}</td>
      <td>${s.department}</td>
      <td>${s.feesPaid ? "Yes" : "No"}</td>
    </tr>`;
  });
}

document.getElementById("studentForm").addEventListener("submit", async e => {
  e.preventDefault();
  const student = {
    name: document.getElementById("studentName").value,
    age: document.getElementById("studentAge").value,
    department: document.getElementById("studentDept").value,
    feesPaid: false
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  e.target.reset();
  loadStudents();
});

loadStudents();
