const BACKEND_URL =
  "https://crud-app-with-ip-lookup-integration.onrender.com/api/v1/users" ||
  "http://localhost:8000/api/v1/users";

// Jab user form submit karega, toh yeh event listener trigger hoga
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Form ka default submit behavior rok raha hai taaki page reload na ho

  // Form ke inputs se values le rahe hain
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  // Yeh object mein user data ko ek saath rakh rahe hain
  const user = { name, age, gender, phone, email };

  // Hidden field se userId nikal rahe hain, yeh update karne ke time kaam aayega
  const userId = document.getElementById("userId").value;

  // Agar userId exist karta hai, toh user ko update karna hai
  if (userId) {
    // PUT request bhej rahe hain updateUser endpoint pe
    const response = await fetch(`${BACKEND_URL}/updateUser/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, // JSON data bhej rahe hain
      body: JSON.stringify(user), // User object ko stringify karke body mein daal rahe hain
    });

    // Response check kar rahe hain, agar successful hua toh success pop-up dikhayenge
    if (response.ok) {
      Swal.fire("Success!", "User updated successfully.", "success");
    } else {
      Swal.fire("Error!", "Failed to update user.", "error"); // Agar error aayi toh error pop-up dikhayenge
    }
  } else {
    // Agar userId nahi hai, toh naya user create karenge POST request se
    const response = await fetch(`${BACKEND_URL}/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user), //converts a JavaScript object ko JSON string format
    });

    // Response check karke appropriate pop-up dikhayenge
    if (response.ok) {
      Swal.fire("Success!", "User created successfully.", "success");
    } else {
      Swal.fire("Error!", "Failed to create user.", "error");
    }
  }

  // Form ko reset kar rahe hain submit hone ke baad
  document.getElementById("userForm").reset();
  document.getElementById("userId").value = ""; // Hidden field bhi reset kar rahe hain
  loadUsers(); // Users ko load karte hain taaki updated list dikhayi de
});

// Yeh function saare users ko load kar raha hai table mein
async function loadUsers() {
  const res = await fetch(`${BACKEND_URL}/getDetails`);
  if (!res.ok) {
    console.error("failed to load users:"); 
    return;
  }

  const data = await res.json();
  const users = data.users;
  console.log(users); 

  // Table body ko clear kar rahe hain taaki naye rows add ho sakein
  const tableBody = document.getElementById("userTable").querySelector("tbody");
  tableBody.innerHTML = "";

  // Array ke har user ke liye ek row create kar rahe hain
  users.map((user) => {
    
    const kelvinToCelsius = (kelvin) => kelvin - 273.15;
    const temp = kelvinToCelsius(user.weather?.main?.temp).toFixed(2); 

    // Row ka HTML banate hain user ke data ke saath
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
        <button class="deleteBtn" onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row); 
  });
}

// Yeh function ek specific user ko edit karne ke liye hai
async function editUser(id) {
  const res = await fetch(`${BACKEND_URL}/getUserById/${id}`); 
  const data = await res.json();
  const user = data.user;
  console.log(user); 

  // User ki details ko form fields mein daal rahe hain edit ke liye
  document.getElementById("name").value = user.name;
  document.getElementById("age").value = user.age;
  document.getElementById("gender").value = user.gender;
  document.getElementById("phone").value = user.phone;
  document.getElementById("email").value = user.email;
  document.getElementById("userId").value = user._id; 

  document.getElementById("userForm").scrollIntoView({ behavior: "smooth" }); // Form ko smoothly scroll kar rahe hain
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

// Page load hote hi saare users ko table mein load kar rahe hain
window.onload = loadUsers;
