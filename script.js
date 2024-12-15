document.addEventListener("DOMContentLoaded", function() {
    // Battery monitoring elements
    const batteryStatusElement = document.getElementById("batteryStatus");
    const voltageElement = document.getElementById("voltage");
    const currentElement = document.getElementById("current");
    const temperatureElement = document.getElementById("temperature");

    const batteryStatusBar = document.getElementById("batteryStatusBar");
    const voltageBar = document.getElementById("voltageBar");
    const currentBar = document.getElementById("currentBar");
    const temperatureBar = document.getElementById("temperatureBar");

    // Weather display elements
    const weatherTempElement = document.getElementById("weatherTemp");
    const weatherHumidityElement = document.getElementById("weatherHumidity");
    const weatherConditionElement = document.getElementById("weatherCondition");

    let weatherTemperature = 0; // Variable to store weather temperature

    // Fetch data for battery monitoring (simulated data)
    function fetchData() {
        const channelId = "2781131"; // Replace with your ThingSpeak channel ID
        const readApiKey = "B6WQEV9X7HCFF9KF"; // Replace with your ThingSpeak read API key
    
        fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=1`)
            .then(response => response.json())
            .then(data => {
                console.log("Raw ThingSpeak Data:", data); // Log raw API response
    
                // Ensure feeds data is available
                if (!data.feeds || data.feeds.length === 0) {
                    console.error("No feed data available! Full response:", data);
                    return;
                }
    
                const feed = data.feeds[0];
    
                // Extract and parse data fields
                const current = feed.field1 ? parseFloat(feed.field1) : 0;
                const voltage = feed.field2 ? parseFloat(feed.field2) : 0; // Voltage could be null
    
                console.log("Parsed Values:", { current, voltage }); // Debug log for parsed values
    
                // Update UI elements
                updateCurrent(current);
                if (voltage !== 0) {  // Only update if voltage is available
                    updateVoltage(voltage);
                }
                updateBatteryStatus(current); // Using current for battery status for now
    
                currentElement.textContent = current.toFixed(2) + " A";
                voltageElement.textContent = voltage ? voltage.toFixed(2) + " V" : "No data available";

                // Set temperature to the weather temperature
                temperatureElement.textContent = weatherTemperature ? `${weatherTemperature.toFixed(2)} °C` : "N/A";
                updateTemperature(weatherTemperature);  // Set temperature bar to weather temperature

                // Update battery health based on temperature
                if (weatherTemperature < 50) {
                    batteryStatusElement.textContent = "Healthy";
                } else {
                    batteryStatusElement.textContent = "Needs Maintenance";
                }
            })
            .catch(error => {
                console.error("Error fetching ThingSpeak data:", error);
            });
    }
    
    // Helper functions to update progress bars
    function updateBatteryStatus(percentage) {
        batteryStatusBar.style.width = `${percentage}%`;
    }
    
    function updateVoltage(voltage) {
        const voltagePercentage = Math.min(Math.max((voltage - 10) / 5 * 100, 0), 100); // Scale voltage to a 0-100% range
        voltageBar.style.width = `${voltagePercentage}%`;
    }
    
    function updateCurrent(current) {
        const currentPercentage = Math.min(Math.max((current - 0) / 10 * 100, 0), 100); // Scale current to a 0-100% range
        currentBar.style.width = `${currentPercentage}%`;
    }
    
    function updateTemperature(temperature) {
        const tempPercentage = Math.min(Math.max((temperature - 0) / 50 * 100, 0), 100); // Scale temperature to a 0-100% range
        temperatureBar.style.width = `${tempPercentage}%`;
    }
    
    // Trigger data fetching every 5 seconds
    fetchData(); // Initial call to load data
    setInterval(fetchData, 5000); // Repeat every 5 seconds

    // Fetch weather data from OpenWeatherMap API
    function fetchWeather() {
        const apiKey = "ade8b2bf269370cc88645a63012041d9";  // Replace with your OpenWeatherMap API key
        const city = "Bengaluru";  // Replace with the desired city

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                const condition = data.weather[0].description;

                // Update weather display
                weatherTempElement.textContent = temp;
                weatherHumidityElement.textContent = humidity;
                weatherConditionElement.textContent = condition;

                // Store weather temperature for battery temperature
                weatherTemperature = temp; // Use this temperature for battery
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherTempElement.textContent = "Error";
                weatherHumidityElement.textContent = "Error";
                weatherConditionElement.textContent = "Error";
            });
    }

    // Fetch weather data on load and every 10 minutes
    fetchWeather(); // Initial call to load weather data
    setInterval(fetchWeather, 600000); // Repeat every 10 minutes
});
