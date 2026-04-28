async function testApi(id: number) {
  console.log(`[Request ${id}] Sending...`);
  try {
    const response = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengeId: 'demo-challenge',
        code: `<div style="width: 100px; height: 100px; background: red;">Test ${id}</div>`
      })
    });
    const data = await response.json();
    console.log(`[Request ${id}] Response: ${response.status}`, data.score ? `Score: ${data.score}` : data);
  } catch (err) {
    console.error(`[Request ${id}] Error:`, (err as Error).message);
  }
}

async function run() {
  console.log("Simulating 10 users submitting at once to http://localhost:3000/api/submit...");
  const promises = [];
  for (let i = 1; i <= 10; i++) {
    promises.push(testApi(i));
  }
  await Promise.all(promises);
  console.log("All requests complete.");
  process.exit(0);
}

run();
