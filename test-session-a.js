async function testSendOtpValidation() {
  const url = "http://127.0.0.1:3001/api/auth/send-otp";
  const badPayload = { phone: "invalid-phone-number" };

  console.log(`Testing /send-otp with invalid payload: ${JSON.stringify(badPayload)}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(badPayload),
    });

    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Response Body: ${JSON.stringify(data, null, 2)}`);

    if (response.status === 400 && data.success === false) {
      console.log("✅ Test Passed: Received 400 Bad Request with error JSON.");
    } else {
      console.error(`❌ Test Failed: Expected 400, but got ${response.status}.`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Test Error: Failed to connect to the server. Is it running on port 3001?");
    console.error(error);
    process.exit(1);
  }
}

testSendOtpValidation();
