/**
 * VOYORA AUTOMATED VERIFICATION & TEST SUITE
 * Validates Requirement 16 Scenarios against the live Backend API
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

async function runTestSuite() {
  console.log('====================================================');
  console.log('  VOYORA AUTOMATED FULL-STACK VERIFICATION SUITE    ');
  console.log(`  Target: ${BASE_URL}                               `);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• Testing [${name}] ... `);
    try {
      await fn();
      console.log('PASSED ✓');
      passed++;
    } catch (err) {
      console.log(`FAILED ✗: ${err.message}`);
      failed++;
    }
  }

  // 1. Health & Server Status
  await test('Backend Health & DB Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Healthcheck returned status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Healthcheck status was not ok');
  });

  // 2. Scenario 1 & 2: Search for a destination & Apply filters
  await test('Scenario 1 & 2: Search destinations & filter by category', async () => {
    const res = await fetch(`${BASE_URL}/destinations?q=Eiffel&category=Landmark`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('Search returned empty');
    if (!json.data[0].name.toLowerCase().includes('eiffel')) throw new Error('Expected Eiffel Tower');
  });

  // 3. Scenario 3: Change sorting
  await test('Scenario 3: Sort destinations by name ascending', async () => {
    const res = await fetch(`${BASE_URL}/destinations?sort=name_asc&limit=5`);
    const json = await res.json();
    if (json.data.length < 2) throw new Error('Need at least 2 items');
    const first = json.data[0].name;
    const second = json.data[1].name;
    if (first.localeCompare(second) > 0) throw new Error('Sorting failed');
  });

  // 4. Scenario 4: Open destination details
  await test('Scenario 4: Retrieve destination details by ID', async () => {
    const res = await fetch(`${BASE_URL}/destinations/dest_paris_eiffel`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.data || json.data.id !== 'dest_paris_eiffel') throw new Error('Invalid destination returned');
  });

  // 5. Scenario 5 & 15: Add destination to trip & test duplicate prevention
  let addedItemId = '';
  await test('Scenario 5 & 15: Add destination to trip & verify duplicate prevention', async () => {
    const testDest = {
      destinationId: 'dest_test_tokyo',
      name: 'Tokyo Test Tower',
      category: 'Landmark',
      city: 'Tokyo',
      country: 'Japan',
      lat: 35.6586,
      lng: 139.7454,
      dayNumber: 4,
      notes: 'Scenic sunset visit',
      isMustVisit: true,
    };

    // First addition
    const res1 = await fetch(`${BASE_URL}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDest),
    });
    if (!res1.ok) throw new Error(`Add failed: ${res1.status}`);
    const json1 = await res1.json();
    addedItemId = json1.data.id;

    // Second addition (Duplicate attempt for same day)
    const res2 = await fetch(`${BASE_URL}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDest),
    });
    if (res2.status !== 409) {
      throw new Error(`Expected 409 Conflict for duplicate, got ${res2.status}`);
    }
  });

  // 6. Scenario 6 & 8: Verify persistence & day assignment
  await test('Scenario 6 & 8: Verify persistence & day grouping', async () => {
    const res = await fetch(`${BASE_URL}/itinerary`);
    const json = await res.json();
    const found = json.data.find(i => i.id === addedItemId);
    if (!found) throw new Error('Newly added item was not persisted in database');
    if (found.dayNumber !== 4) throw new Error('Day number was not preserved');
  });

  // 7. Scenario 9: Add and remove personal notes
  await test('Scenario 9: Update personal notes and must-visit status', async () => {
    const res = await fetch(`${BASE_URL}/itinerary/${addedItemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: 'Updated personal note: Verified opening hours at 10:00',
        isMustVisit: false,
      }),
    });
    if (!res.ok) throw new Error('Failed to update notes');
    const json = await res.json();
    if (!json.data.notes.includes('10:00')) throw new Error('Notes did not update');
    if (json.data.isMustVisit !== false) throw new Error('Must-visit did not update');
  });

  // 8. Scenario 7: Reorder itinerary items
  await test('Scenario 7: Reorder itinerary items', async () => {
    const res = await fetch(`${BASE_URL}/itinerary/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: addedItemId, sortOrder: 99 }],
      }),
    });
    if (!res.ok) throw new Error('Reorder request failed');
  });

  // 9. Clean up test item
  await test('Cleanup: Remove test item from itinerary', async () => {
    const res = await fetch(`${BASE_URL}/itinerary/${addedItemId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete itinerary item');
  });

  // 10. Scenario 10: Add and remove favorites
  await test('Scenario 10: Add, list, and remove favorite', async () => {
    // Add favorite
    const addRes = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: 'dest_test_fav_kyoto',
        name: 'Kyoto Test Pavilion',
        category: 'Historic',
        city: 'Kyoto',
        country: 'Japan',
        lat: 35.0,
        lng: 135.7,
      }),
    });
    if (!addRes.ok) throw new Error(`Add favorite failed: ${addRes.status}`);

    // Verify in list
    const listRes = await fetch(`${BASE_URL}/favorites`);
    const listJson = await listRes.json();
    const inList = listJson.data.some(f => f.destinationId === 'dest_test_fav_kyoto');
    if (!inList) throw new Error('Favorite not found in favorites list');

    // Remove favorite
    const delRes = await fetch(`${BASE_URL}/favorites/dest_test_fav_kyoto`, {
      method: 'DELETE',
    });
    if (!delRes.ok) throw new Error('Failed to delete favorite');
  });

  // 11. Scenario 11: Weather integration for valid coordinates
  await test('Scenario 11: Retrieve real weather telemetry from Open-Meteo', async () => {
    const res = await fetch(`${BASE_URL}/weather?lat=48.8584&lng=2.2945`);
    if (!res.ok) throw new Error(`Weather API failed with status ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.current) throw new Error('Invalid weather payload');
    if (typeof json.data.current.temperature !== 'number') throw new Error('Temperature missing');
  });

  // 12. Scenario 13: Search for nonexistent destinations
  await test('Scenario 13: Search for nonexistent destination returns empty result', async () => {
    const res = await fetch(`${BASE_URL}/destinations?q=NonExistentZzXxYyWw`);
    const json = await res.json();
    if (json.data.length !== 0) throw new Error('Expected 0 results for nonexistent destination');
  });

  // 13. Scenario 16: Test invalid destination ID
  await test('Scenario 16: Test invalid destination ID returns 404', async () => {
    const res = await fetch(`${BASE_URL}/destinations/invalid_id_99999`);
    if (res.status !== 404) throw new Error(`Expected 404 Not Found, got ${res.status}`);
  });

  // 14. Scenario 17: Test invalid API inputs
  await test('Scenario 17: Test invalid API input rejection (400 Bad Request)', async () => {
    // Missing required fields
    const res = await fetch(`${BASE_URL}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
  });

  // 15. Scenario 18: Smart Planner rule-based generation
  await test('Smart Planner: Generate rule-based 3-day itinerary', async () => {
    const res = await fetch(`${BASE_URL}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: 'Paris',
        days: 3,
        pace: 'balanced',
        interests: ['Architecture & Icons'],
      }),
    });
    if (!res.ok) throw new Error(`Planner failed with status ${res.status}`);
    const json = await res.json();
    if (!json.data.days || json.data.days.length !== 3) throw new Error('Expected 3 days in plan');
  });

  // 16. Shareable Itinerary: Creation & Retrieval
  await test('Shareable Itinerary: Create snapshot and fetch via shareId', async () => {
    const shareRes = await fetch(`${BASE_URL}/itinerary/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Shared Trip' }),
    });
    if (!shareRes.ok) throw new Error('Share creation failed');
    const shareJson = await shareRes.json();
    const shareId = shareJson.shareId;

    const getRes = await fetch(`${BASE_URL}/itinerary/share/${shareId}`);
    if (!getRes.ok) throw new Error('Fetching shared trip failed');
    const getJson = await getRes.json();
    if (getJson.data.title !== 'Test Shared Trip') throw new Error('Shared trip title mismatch');
  });

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED `);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
