const emptyRoomDB = {
  "8-9": {
    4: ["401", "402", "403"],
    3: ["301", "302"]
  },
  "9-10": {
    4: ["404", "405"],
    3: ["303"]
  },
  "10-11": {
    3: ["304", "305"]
  }
};

function showFloorDropdown() {
  document.getElementById("floorSelect").style.display = "block";
  document.getElementById("roomResult").innerHTML = "";
}

function findEmptyRooms() {
  const time = document.getElementById("timeSlot").value;
  const floor = document.getElementById("floorSelect").value;

  const result = document.getElementById("roomResult");

  if (!time || !floor) {
    result.innerHTML = "";
    return;
  }

  const rooms = emptyRoomDB[time]?.[floor] || [];

  if (rooms.length === 0) {
    result.innerHTML = "<p>No empty rooms available</p>";
    return;
  }

  result.innerHTML = `
    <div class="card">
      <h3>Empty Rooms</h3>
      <p>${rooms.join(", ")}</p>
    </div>
  `;
}