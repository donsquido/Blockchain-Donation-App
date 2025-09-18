from flask import Flask, render_template, request, jsonify
import razorpay

app = Flask(__name__)

# Replace with your Razorpay test keys
razorpay_client = razorpay.Client(auth=("rzp_test_YOUR_KEY", "YOUR_SECRET"))

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/payment')
def payment():
    return render_template('index.html')  # index.html should have Razorpay code

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/create_order', methods=['POST'])
def create_order():
    data = request.get_json()
    amount = int(data.get('amount', 100)) * 100  # ₹ to paise
    payment = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    })
    return jsonify(payment)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Railway gives PORT automatically
    app.run(host="0.0.0.0", port=port)