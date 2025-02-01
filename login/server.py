from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from flask_cors import CORS  # Allow frontend to talk to backend
import time

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

@app.route("/send-message", methods=["POST"])
def send_message():
    try:
        data = request.json
        phone_number = data.get("phone")

        if not phone_number:
            return jsonify({"message": "Invalid phone number"}), 400

        message = "Hello! This is an automated message from my personal WhatsApp."

        # Start WhatsApp Web automation
        driver = webdriver.Chrome()  # Ensure chromedriver is in your path
        driver.get(f"https://web.whatsapp.com/send?phone={phone_number}&text={message}")

        time.sleep(10)  # Wait for page to load manually (scan QR code if needed)

        send_button = driver.find_element(By.XPATH, '//button[@aria-label="Send"]')
        send_button.click()

        time.sleep(2)  # Give it some time to send
        driver.quit()

        return jsonify({"message": "Message sent successfully!"}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5501)  # Ensure the port matches your frontend
