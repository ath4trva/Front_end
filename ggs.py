import pandas as pd
import folium
from folium.plugins import HeatMap
import os


# Load the dataset
df = pd.read_excel(r"C:\Users\ADMIN\Documents\air_quality_data.xlsx")


# Create a map centered at the average location
m = folium.Map(location=[df["lat"].mean(), df["lon"].mean()], zoom_start=10)

# Prepare data for heatmap
heat_data = list(zip(df["lat"], df["lon"], df["AQI"]))
df = df.groupby(['lat', 'lon'], as_index=False).mean()  # Averaging AQI for duplicate locations
df['AQI'] = df['AQI'].astype(int) 

# Add heatmap layer
HeatMap(
    heat_data, 
    radius=50,    
    blur=30,      
    min_opacity=0.3,  
    max_zoom=10,  
    gradient={
        "0.2": 'green', 
        "0.4": 'yellow', 
        "0.6": 'red', 
        "0.8": 'red', 
        "1.0": 'red'  
    }
).add_to(m)

# Add a semi-transparent red overlay
folium.TileLayer(
    tiles="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr="Filtered Map",
    name="AQI Filter",
    overlay=True,
    control=False,
    opacity=0.3  # Adjust transparency (0.1 to 1.0)
).add_to(m)


def get_aqi_color(aqi):
    """Returns background and text color based on AQI level."""
    if aqi <= 50:
        return "green", "white"   # Good
    elif aqi <= 100:
        return "yellow", "black"  # Moderate
    elif aqi <= 150:
        return "orange", "black"  # Unhealthy for sensitive groups
    elif aqi <= 200:
        return "red", "white"     # Unhealthy
    elif aqi <= 300:
        return "purple", "white"  # Very Unhealthy
    else:
        return "maroon", "white"  # Hazardous

for index, row in df.iterrows():
    aqi = int(row['AQI'])  # Ensure AQI is an integer
    bg_color, text_color = get_aqi_color(aqi)  # Get dynamic colors

    folium.Marker(
        location=[row['lat'], row['lon']],  
        popup=f"AQI: {aqi}",  # Shows AQI when clicked
        icon=folium.DivIcon(html=f"""
            <div style="font-size: 14px; color: {text_color}; 
                        background: {bg_color}; padding: 4px 6px; 
                        border-radius: 5px; display: inline-block; 
                        white-space: nowrap; text-align: center;">
                {aqi}
            </div>""")  # Dynamic color based on AQI
    ).add_to(m)








# Save the map as an HTML file
m.save(r"E:\gg\air_quality_heatmap6.html")


print("Heatmap saved as air_quality_heatmap6.html")
