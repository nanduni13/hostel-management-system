const API_URL = "http://localhost:8000/api/rooms";

async function loadRooms() {
  const res = await fetch(API_URL);
  const rooms = await res.json();
  const tbody = document.querySelector("#roomsTable tbody");
  tbody.innerHTML = "";
  rooms.forEach(r => {
    tbody.innerHTML += `<tr>
      <td>${r.roomNo}</td>
      <td>${r.capacity}</td>
      <td>${r.status}</td>
    </tr>`;
  });
}

document.getElementById("roomForm").addEventListener("submit", async e => {
  e.preventDefault();
  const room = {
    roomNo: document.getElementById("roomNo").value,
    capacity: document.getElementById("capacity").value,
    status: "available"
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room)
  });
  e.target.reset();
  loadRooms();
});

loadRooms();
