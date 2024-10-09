// backend/controllers/userController.js
const User = require("../models/User");
const axios = require("axios");

// IP Lookup
const fetchLocation = async () => {
  // console.log("location : ");
  // const response = await axios.get(
  //   "https://webhook.site/4388f18c-41d2-4d73-8d08-65c46ac2368c"
  // );
  const response = await axios.get("https://ipapi.co/json/");
  // console.log(response.data);
  const { city, region, country_name } = response.data;
  return { city, region, country_name };
};

// Weather Lookup
const fetchWeather = async (city) => {
  const apiKey = process.env.API_KEY;
  // const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await axios.get(weatherUrl);
  // console.log(response.data);uyi87

  return response.data;
};

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, age, gender, phone, email } = req.body;
    // console.log("data", req.body);

    const location = await fetchLocation();
    // console.log("location", location);

    const weather = await fetchWeather(location.city);

    const user = new User({
      name,
      age,
      gender,
      phone,
      email,
      country: location.country_name,
      region: location.region,
      city: location.city,
      weather,
    });

    console.log("user", user);
    await user.save();
    res.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

// Read Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "User Fetched Successfully",
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch the Users",
      error,
    });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found"
      });
    }

    res.status(200).json({
      meesage:"User Details fetched ById",
      user
    });
  } catch (error) {

    res.status(500).json({ 
      message: "Server Error", 
      error 
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, email } = req.body;

    const location = await fetchLocation();
    const weather = await fetchWeather(location.city);

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        age,
        gender,
        phone,
        email,
        country: location.country_name,
        region: location.region,
        city: location.city,
        weather,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.status(200).json({
      message: "User Details Updated Successfully",
      user,
    });
  } catch (error) {

    res.status(500).json({ 
      message: "Server Error", 
      error 
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      message: "User deleted Successfully" 
    });
  } catch (error) {

    res.status(500).json({ 
      message: "Server Error", 
      error 
    });
  }
};
