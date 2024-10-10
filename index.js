const BACKEND_URL =
  "https://crud-app-with-ip-lookup-integration.onrender.com/api/v1/users" ||
  "http://localhost:8000/api/v1/users";

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const user = { name, age, gender, phone, email };
  const userId = document.getElementById("userId").value;

  if (userId) {
    const response = await fetch(`${BACKEND_URL}/updateUser/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      Swal.fire("Success!", "User updated successfully.", "success");
    } else {
      Swal.fire("Error!", "Failed to update user.", "error");
    }
  } else {
    const response = await fetch(`${BACKEND_URL}/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      Swal.fire("Success!", "User created successfully.", "success");
    } else {
      Swal.fire("Error!", "Failed to create user.", "error");
    }
  }

  document.getElementById("userForm").reset();
  document.getElementById("userId").value = ""; 
  loadUsers();
});

async function loadUsers() {
  const res = await fetch(`${BACKEND_URL}/getDetails`);
  if (!res.ok) {
    console.error("Failed to load users:", await res.text());
    return;
  }
  const data = await res.json();
  const users = data.users;
  console.log(users);

  const tableBody = document.getElementById("userTable").querySelector("tbody");
  tableBody.innerHTML = "";

  users.map((user) => {
    const kelvinToCelsius = (kelvin) => kelvin - 273.15;
    const temp = kelvinToCelsius(user.weather?.main?.temp).toFixed(2);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.age}</td>
      <td>${user.gender}</td>
      <td>${user.phone}</td>
      <td>${user.email}</td>
      <td>
          ${user.city}, 
          ${user.region}, 
          ${user.country}
      </td> 
      <td>
           ${user.weather.weather[0].description.toUpperCase() || ""}, 
           ${temp || ""}°C
      </td>
      <td>
        <button class="editBtn" onclick="editUser('${user._id}')">Edit</button>
        <button class="deleteBtn" onclick="deleteUser('${
          user._id
        }')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function editUser(id) {
  const res = await fetch(`${BACKEND_URL}/getUserById/${id}`);
  const data = await res.json();
  const user = data.user;
  console.log(user);

  document.getElementById("name").value = user.name;
  document.getElementById("age").value = user.age;
  document.getElementById("gender").value = user.gender;
  document.getElementById("phone").value = user.phone;
  document.getElementById("email").value = user.email;
  document.getElementById("userId").value = user._id;

  document.getElementById("userForm").scrollIntoView({ behavior: "smooth" });
}

async function deleteUser(id) {
  const res = await fetch(`${BACKEND_URL}/deleteUser/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    Swal.fire("Deleted!", "User deleted successfully.", "success");
  } else {
    Swal.fire("Error!", "Failed to delete user.", "error");
  }

  loadUsers();
}

// On page load
window.onload = loadUsers;
