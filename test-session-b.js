
async function testTrendsApi() {
  const url = 'http://127.0.0.1:3002/api/research/trends';
  console.log(`Testing trends API at ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response received successfully:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching trends:', error.message);
    process.exit(1);
  }
}

testTrendsApi();
