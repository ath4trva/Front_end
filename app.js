// AQI ranges and their corresponding status
const aqiRanges = [
    { min: 0, max: 50, status: 'Good', color: '#00e400' },
    { min: 51, max: 100, status: 'Moderate', color: '#ffff00' },
    { min: 101, max: 150, status: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
    { min: 151, max: 200, status: 'Unhealthy', color: '#ff0000' },
    { min: 201, max: 300, status: 'Very Unhealthy', color: '#8f3f97' },
    { min: 301, max: 500, status: 'Hazardous', color: '#7e0023' }
];

// Function to calculate the position percentage based on AQI value
function calculatePositionPercentage(value) {
    // Ensure value is within valid range (0-500)
    const clampedValue = Math.min(Math.max(value, 0), 500);
    
    // Calculate percentage based on scale segments
    if (clampedValue <= 50) {
        return (clampedValue / 50) * 16.67; // First segment (0-50)
    } else if (clampedValue <= 100) {
        return 16.67 + ((clampedValue - 50) / 50) * 16.67; // Second segment (51-100)
    } else if (clampedValue <= 150) {
        return 33.34 + ((clampedValue - 100) / 50) * 16.67; // Third segment (101-150)
    } else if (clampedValue <= 200) {
        return 50.01 + ((clampedValue - 150) / 50) * 16.67; // Fourth segment (151-200)
    } else if (clampedValue <= 300) {
        return 66.68 + ((clampedValue - 200) / 100) * 16.67; // Fifth segment (201-300)
    } else {
        return 83.35 + ((clampedValue - 300) / 200) * 16.65; // Last segment (301-500)
    }
}

// Function to update AQI marker position and status
function updateAQI(value) {
    const aqiValue = parseInt(value);
    const aqiMarker = document.getElementById('aqiMarker');
    const aqiStatus = document.getElementById('aqiStatus');
    const aqiDisplay = document.getElementById('aqiValue');
    
    // Update the displayed AQI value
    aqiDisplay.textContent = aqiValue;
    
    // Calculate the marker position
    const percentage = calculatePositionPercentage(aqiValue);
    aqiMarker.style.left = `${percentage}%`;
    
    // Find the current range and update status
    const currentRange = aqiRanges.find(range => aqiValue <= range.max);
    if (currentRange) {
        aqiStatus.textContent = currentRange.status;
        aqiStatus.style.backgroundColor = `${currentRange.color}20`;
        aqiStatus.style.color = currentRange.color;
        aqiDisplay.style.color = currentRange.color;
    }
}

// Initialize with current AQI value
document.addEventListener('DOMContentLoaded', () => {
    const initialAQI = document.getElementById('aqiValue').textContent;
    updateAQI(initialAQI);
    
    // Optional: Add click event for the locate button
    document.getElementById('locateBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    });
});

// Function to test different AQI values
function testAQI(value) {
    updateAQI(value);
}

// Uncomment to test different values
// Examples of testing different ranges:
// setTimeout(() => testAQI(25), 1000);   // Good
// setTimeout(() => testAQI(75), 2000);   // Moderate
// setTimeout(() => testAQI(125), 3000);  // Unhealthy for Sensitive Groups
// setTimeout(() => testAQI(175), 4000);  // Unhealthy
// setTimeout(() => testAQI(250), 5000);  // Very Unhealthy
// setTimeout(() => testAQI(350), 6000);  // Hazardous

// Existing AQI code remains the same

// Chart Integration
let currentChartType = 'bar';
let currentMetric = 'AQI';
let currentTimeRange = '24 Hours';
let barChart, lineChart;

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#555' },
            ticks: { color: '#fff' }
        },
        x: {
            grid: { color: '#555' },
            ticks: { color: '#fff' }
        }
    },
    plugins: {
        legend: {
            labels: { color: '#fff' }
        }
    }
};

function generateData() {
    const dataPoints = {
        '24 Hours': 24,
        '7 Days': 7,
        '30 Days': 30
    };
    
    const maxValues = {
        'AQI': 300,
        'PM2.5': 150,
        'PM10': 200
    };

    return Array.from({ length: dataPoints[currentTimeRange] }, () => 
        Math.floor(Math.random() * maxValues[currentMetric])
    );
}

function createLabels() {
    if (currentTimeRange === '24 Hours') {
        return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    }
    return Array.from({ length: currentTimeRange === '7 Days' ? 7 : 30 }, (_, i) => 
        currentTimeRange === '7 Days' ? `Day ${i + 1}` : `Day ${i + 1}`
    );
}

function updateCharts() {
    const labels = createLabels();
    const data = generateData();

    [barChart, lineChart].forEach(chart => {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].label = currentMetric;
        chart.update();
    });
}

function toggleChart(type) {
    currentChartType = type;
    document.querySelectorAll('.graph-buttons button').forEach(btn => 
        btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('barChart').style.display = type === 'bar' ? 'block' : 'none';
    document.getElementById('lineChart').style.display = type === 'line' ? 'block' : 'none';
}

function initializeCharts() {
    const labels = createLabels();
    const data = generateData();

    const barCtx = document.getElementById('barChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: currentMetric,
                data: data,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: commonOptions
    });

    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: currentMetric,
                data: data,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255,152,0,0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code
    const initialAQI = document.getElementById('aqiValue').textContent;
    updateAQI(initialAQI);
    
    document.getElementById('locateBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    });

    // Initialize charts
    initializeCharts();

    // Chart event listeners
    document.getElementById('timeRange').addEventListener('change', () => {
        currentTimeRange = document.getElementById('timeRange').value;
        updateCharts();
    });

    document.getElementById('metric').addEventListener('change', () => {
        currentMetric = document.getElementById('metric').value;
        updateCharts();
    });
});

// animation
// Add at the bottom of your JavaScript file, inside the DOMContentLoaded event listener
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Add fade-in class to sections and observe them
const sections = [
    document.querySelector('.dashboard'),
    document.querySelector('.graph-container'),
    document.querySelector('.hero-section')
];

sections.forEach(section => {
    if (section) {
        section.classList.add('fade-in');
        observer.observe(section);
    }
});

// Add fade-in to headings
const headings = [
    document.querySelector('.graph-heading'),
    document.querySelector('.card-heading')
];

headings.forEach(heading => {
    if (heading) {
        heading.classList.add('fade-in');
        observer.observe(heading);
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let heatmapLayer = null;
    let heatmapData = [];

    const heatmapConfig = {
        minOpacity: 0.3,
        maxZoom: 8,
        radius: 40,  // Increased for smoother blending
        blur: 25,    // Increased blur for blending effect
        gradient: {
            0.0: '#00e400',   // Good (0-50)
            0.2: '#ffff00',   // Moderate (51-100)
            0.4: '#ff7e00',   // Unhealthy for Sensitive (101-150)
            0.6: '#ff0000',   // Unhealthy (151-200)
            0.8: '#99004c',   // Very Unhealthy (201-300)
            1.0: '#7e0023'    // Hazardous (301+)
        }
    };

    async function fetchData() {
        try {
            const response = await fetch("https://api.waqi.info/map/bounds/?token=24b85682561e075e08edf3e01b936515133e04c9&latlng=6.0,68.1,35.6,97.3");
            const data = await response.json();
            return data.status === 'ok' ? data.data : [];
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    async function fetchAndStoreData() {
        const rawData = await fetchData();

        // Ensure valid AQI values and normalize AQI (0-500) -> scale (0-1)
        heatmapData = rawData.map(station => {
            const aqi = parseInt(station.aqi);
            if (isNaN(aqi) || aqi < 0) return null;
            return [station.lat, station.lon, Math.min(aqi / 500, 1)];
        }).filter(Boolean);
    }

    function updateHeatmap() {
        if (!heatmapData.length) return;

        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
        }

        heatmapLayer = L.heatLayer(heatmapData, heatmapConfig).addTo(map);
    }

    map.on('zoomend', updateHeatmap);

    async function initialize() {
        await fetchAndStoreData();
        updateHeatmap();
        setInterval(async () => {
            await fetchAndStoreData();
            updateHeatmap();
        }, 300000);
    }

    await initialize();
});

function fetchAirQuality() {
    const latitude = 19.0760;  // Mumbai coordinates
    const longitude = 72.8777;
    
    const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,carbon_monoxide,sulphur_dioxide,nitrogen_dioxide,ozone&timezone=auto`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Air Quality Data:', data);
        
        // Update DOM elements with current values
        document.getElementById('pm25-value').textContent = data.current.pm2_5.toFixed(1);
        document.getElementById('pm10-value').textContent = data.current.pm10.toFixed(1);
        document.getElementById('co-value').textContent = data.current.carbon_monoxide.toFixed(3);
        document.getElementById('so2-value').textContent = data.current.sulphur_dioxide.toFixed(3);
        document.getElementById('no2-value').textContent = data.current.nitrogen_dioxide.toFixed(3);
        document.getElementById('o3-value').textContent = data.current.ozone.toFixed(3);
        
        // Update last updated time
        const lastUpdated = document.querySelector('.last-updated');
        const updateTime = new Date(data.current.time).toLocaleTimeString();
        lastUpdated.textContent = `Last Updated: ${updateTime}`;
      })
      .catch(error => {
        console.error('Error fetching air quality data:', error);
        document.querySelectorAll('.value').forEach(el => el.textContent = 'N/A');
      });
  }

  // Initial fetch
  fetchAirQuality();
  
  // Refresh data every 5 minutes
  setInterval(fetchAirQuality, 300000);