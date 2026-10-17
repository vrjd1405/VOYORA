// Test city isolation and new routing endpoints
async function runTests() {
  console.log("=== Testing 100% Strict City Isolation for Tamil Nadu & India ===");
  
  const testCities = [
    'Chennai',
    'Madurai',
    'Coimbatore',
    'Mahabalipuram',
    'Thanjavur',
    'Kanyakumari',
    'Ooty',
    'Kodaikanal',
    'Rameswaram',
    'Tiruchirappalli',
    'Bengaluru',
    'Delhi'
  ];

  let totalPassed = 0;

  for (const city of testCities) {
    const url = `http://localhost:5000/api/destinations?city=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL: ${city} returned HTTP ${res.status}`);
      continue;
    }
    const json = await res.json();
    const dests = json.data || [];
    
    if (dests.length === 0) {
      console.error(`FAIL: ${city} returned 0 destinations!`);
      continue;
    }

    const alienDests = dests.filter(d => {
      const c = d.city.toLowerCase();
      const q = city.toLowerCase();
      // Allow known aliases
      if (q === 'ooty' && (c === 'ooty' || c === 'udhagamandalam')) return false;
      if (q === 'mahabalipuram' && (c === 'mahabalipuram' || c === 'mamallapuram')) return false;
      if (q === 'tiruchirappalli' && (c === 'tiruchirappalli' || c === 'trichy')) return false;
      return !c.includes(q) && !q.includes(c);
    });

    if (alienDests.length > 0) {
      console.error(`FAIL: ${city} leaked foreign destinations from:`, alienDests.map(d => `${d.name} (${d.city})`));
    } else {
      console.log(`PASS: ${city} returned ${dests.length} destinations, 100% strictly belonging to ${city}:`);
      dests.slice(0, 3).forEach(d => console.log(`   - ${d.name} (${d.city})`));
      totalPassed++;
    }
  }

  console.log("\n=== Testing Smart Journey Architect for Madurai (No Cross-City Injections) ===");
  const planRes = await fetch("http://localhost:5000/api/planner/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city: "Madurai",
      days: 3,
      interests: ["Spiritual Temples & Shrines", "Historic Antiquities"],
      pace: "balanced"
    })
  });

  if (planRes.ok) {
    const planJson = await planRes.json();
    const plan = planJson.data;
    console.log(`Plan generated for: ${plan.city}, total stops: ${plan.totalPlaces}`);
    let planPassed = true;
    for (const day of plan.days) {
      for (const item of day.items) {
        if (!item.destination.city.toLowerCase().includes('madurai')) {
          console.error(`FAIL: Leaked non-Madurai place: ${item.destination.name} (${item.destination.city})`);
          planPassed = false;
        }
      }
    }
    if (planPassed) {
      console.log("PASS: 100% of generated itinerary stops strictly belong to Madurai!");
      totalPassed++;
    }
  } else {
    console.error("FAIL: Smart Planner returned HTTP error", planRes.status);
  }

  console.log("\n=== Testing Geoapify Transit & Distance Route Calculation ===");
  const routeRes = await fetch("http://localhost:5000/api/destinations/route?fromLat=13.0500&fromLng=80.2824&toLat=13.0334&toLng=80.2699&mode=drive");
  if (routeRes.ok) {
    const routeJson = await routeRes.json();
    console.log("PASS: Route calculated successfully:", routeJson.data.summary);
    totalPassed++;
  } else {
    console.error("FAIL: Route calculation failed", routeRes.status);
  }

  console.log(`\nTests finished: ${totalPassed}/${testCities.length + 2} passed.`);
}

runTests().catch(console.error);
