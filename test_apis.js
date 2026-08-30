const API_BASE = 'http://localhost:9090';

const ts = Date.now();
// Generate unique phone numbers to avoid "already exists" clashes
const rPhone = () => '9' + String(Math.floor(Math.random() * 900000000) + 100000000);
const restaurantPhone = rPhone();

let pass = 0, fail = 0;
const RESULTS = [];

async function callApi(name, method, endpoint, payload = null, expectFail = false) {
  try {
    const options = { method, headers: {} };
    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await res.text();
    let parsedJson = null;
    try { parsedJson = JSON.parse(text); } catch (e) {}

    const success = res.ok || res.status === 201;
    const passed = expectFail ? !success : success;

    if (passed) {
      pass++;
      console.log(`✅ [PASS] ${name}${expectFail ? ' (correctly rejected)' : ''}`);
    } else {
      fail++;
      console.log(`❌ [FAIL] ${name} | HTTP ${res.status} | ${text}`);
    }
    RESULTS.push({ name, passed, status: res.status, body: text });
    return { ok: success, data: parsedJson || text, status: res.status };
  } catch (err) {
    fail++;
    console.log(`❌ [ERROR] ${name} | ${err.message}`);
    RESULTS.push({ name, passed: false, status: 0, body: err.message });
    return { ok: false };
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════');
  console.log('  🧪 ZOMATO BACKEND — FULL API TEST SUITE');
  console.log('═══════════════════════════════════════════════\n');

  // Track dynamic IDs
  let restaurantId, menuItemId, variantId;

  // ────────────────────────────────────────
  // RESTAURANT TESTS
  // ────────────────────────────────────────
  console.log('━━━ RESTAURANT ━━━');

  // 1. Create restaurant
  await callApi('POST /restaurant — Create (valid)', 'POST', '/restaurant', {
    restaurantName: 'Zomato Test Kitchen',
    restaurantPhoneNumber: restaurantPhone,
    streetLine1: 'Plot 42 Sector 18',
    pinCode: '201301',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 28.5700,
    longitude: 77.3200
  });

  // 2. Validation: missing required field
  await callApi('POST /restaurant — Validation (missing name)', 'POST', '/restaurant', {
    restaurantPhoneNumber: '9111222333',
    streetLine1: 'Some Street',
    pinCode: '110001',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6,
    longitude: 77.2
  }, true);

  // 3. Validation: duplicate phone
  await callApi('POST /restaurant — Duplicate phone (should reject)', 'POST', '/restaurant', {
    restaurantName: 'Duplicate Cafe',
    restaurantPhoneNumber: restaurantPhone,
    streetLine1: 'Other Street',
    pinCode: '110002',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6,
    longitude: 77.2
  }, true);

  // 4. GET all restaurants
  const allRest = await callApi('GET /restaurant — Get all', 'GET', '/restaurant');
  if (allRest.ok && Array.isArray(allRest.data)) {
    const found = allRest.data.find(r => r.restaurantPhoneNumber === restaurantPhone || r.restaurantName === 'Zomato Test Kitchen');
    if (found) {
      restaurantId = found.restaurantId;
      console.log(`   📌 Restaurant ID: ${restaurantId}`);
    }
  }

  // 5. GET single restaurant
  if (restaurantId) {
    await callApi(`GET /restaurant/${restaurantId} — Get by ID`, 'GET', `/restaurant/${restaurantId}`);
  }

  // 6. GET non-existent restaurant
  await callApi('GET /restaurant/999999 — Not found (should reject)', 'GET', '/restaurant/999999', null, true);

  // ────────────────────────────────────────
  // MENU ITEM TESTS
  // ────────────────────────────────────────
  console.log('\n━━━ MENU ITEM ━━━');

  // 7. Create menu item (VEG)
  await callApi('POST /menuItem — Create VEG with 2 variants', 'POST', '/menuItem', {
    menuItemName: 'Paneer Butter Masala',
    menuItemDescription: 'Creamy paneer in rich tomato gravy',
    menuItemType: 'VEG',
    menuItemLabel: 'Chef Special',
    restaurantId,
    menuItemVariantRequestDTOList: [
      { menuVariantName: 'Half', menuVariantPrice: 180.0, menuVariantAvailable: true, inventoryManaged: true, currentAvailableInventoryCount: 30 },
      { menuVariantName: 'Full', menuVariantPrice: 320.0, menuVariantAvailable: true, inventoryManaged: true, currentAvailableInventoryCount: 20 }
    ]
  });

  // 8. Create menu item (NONVEG)
  await callApi('POST /menuItem — Create NONVEG', 'POST', '/menuItem', {
    menuItemName: 'Chicken Biryani',
    menuItemDescription: 'Fragrant rice with tender chicken',
    menuItemType: 'NONVEG',
    menuItemLabel: 'Best Seller',
    restaurantId,
    menuItemVariantRequestDTOList: [
      { menuVariantName: 'Regular', menuVariantPrice: 250.0, menuVariantAvailable: true, inventoryManaged: false, currentAvailableInventoryCount: 0 }
    ]
  });

  // 9. Validation: zero price (should fail)
  await callApi('POST /menuItem — Zero price variant (should reject)', 'POST', '/menuItem', {
    menuItemName: 'Bad Item',
    menuItemDescription: 'This should fail',
    menuItemType: 'VEG',
    menuItemLabel: 'Test',
    restaurantId,
    menuItemVariantRequestDTOList: [
      { menuVariantName: 'Zero', menuVariantPrice: 0.0, menuVariantAvailable: true, inventoryManaged: false, currentAvailableInventoryCount: 0 }
    ]
  }, true);

  // 10. Validation: empty variants list (should fail)
  await callApi('POST /menuItem — Empty variants (should reject)', 'POST', '/menuItem', {
    menuItemName: 'No Variants Item',
    menuItemDescription: 'No variants',
    menuItemType: 'VEG',
    menuItemLabel: 'Test',
    restaurantId,
    menuItemVariantRequestDTOList: []
  }, true);

  // 11. Fetch restaurant to extract real IDs
  const refreshed = await callApi(`GET /restaurant/${restaurantId} — Refresh to get item IDs`, 'GET', `/restaurant/${restaurantId}`);
  let singleVariantItemId = null; // Chicken Biryani — always had 1 variant, clean for guard test
  let singleVariantId = null;
  if (refreshed.ok && refreshed.data?.menuItemResponseDTOList?.length > 0) {
    // menuItemResponseDTOList[0] = Paneer Butter Masala (2 variants)
    // menuItemResponseDTOList[1] = Chicken Biryani (1 variant) — use this for guard test
    const mi0 = refreshed.data.menuItemResponseDTOList[0];
    const mi1 = refreshed.data.menuItemResponseDTOList[1];
    menuItemId = mi0.menuItemId;
    variantId = mi0.menuItemVariantResponseDTOList?.[0]?.menuVariantId;
    console.log(`   📌 Paneer Item ID: ${menuItemId}  |  Variant ID: ${variantId}`);
    if (mi1) {
      singleVariantItemId = mi1.menuItemId;
      singleVariantId = mi1.menuItemVariantResponseDTOList?.[0]?.menuVariantId;
      console.log(`   📌 Chicken Biryani Item ID: ${singleVariantItemId}  |  Single Variant ID: ${singleVariantId}`);
    }
  }

  // 12. Edit menu item
  if (menuItemId) {
    await callApi(`PUT /menuItem/${menuItemId} — Edit`, 'PUT', `/menuItem/${menuItemId}`, {
      menuItemName: 'Paneer Butter Masala Updated',
      menuItemDescription: 'Updated creamy paneer dish',
      menuItemType: 'VEG',
      menuItemLabel: 'Must Try',
      restaurantId,
      menuItemVariantRequestDTOList: [
        // Backend requires NotEmpty but ignores the values — send existing one to pass validation
        { menuVariantName: 'Half', menuVariantPrice: 180.0, menuVariantAvailable: true, inventoryManaged: true, currentAvailableInventoryCount: 30 }
      ]
    });
  }

  // ────────────────────────────────────────
  // VARIANT TESTS
  // ────────────────────────────────────────
  console.log('\n━━━ VARIANT ━━━');

  // 13. Edit variant (on Paneer Masala's first variant)
  if (variantId) {
    await callApi(`PUT /menuItemVariant/${variantId} — Edit`, 'PUT', `/menuItemVariant/${variantId}`, {
      menuItemId,
      restaurantId,
      menuItemVariantRequestDTO: {
        menuVariantName: 'Half Plate',
        menuVariantPrice: 200.0,
        menuVariantAvailable: true,
        inventoryManaged: true,
        currentAvailableInventoryCount: 15
      }
    });
  }

  // 14. Get updated restaurant to find Paneer Masala's second variant (Full)
  let secondVariantId;
  const v2 = await callApi(`GET /restaurant/${restaurantId} — After variant edit`, 'GET', `/restaurant/${restaurantId}`);
  if (v2.ok && v2.data?.menuItemResponseDTOList?.length > 0) {
    const paneerItem = v2.data.menuItemResponseDTOList.find(m => m.menuItemId === menuItemId);
    const vars = paneerItem?.menuItemVariantResponseDTOList || [];
    if (vars.length > 1) {
      // Pick the one that is NOT the variantId we already have
      secondVariantId = vars.find(v => v.menuVariantId !== variantId)?.menuVariantId;
      console.log(`   📌 Second Variant ID (will be deleted): ${secondVariantId}`);
    }
  }

  // 15. Delete a non-last variant of Paneer Masala
  if (secondVariantId) {
    await callApi(`DELETE /menuItemVariant/${secondVariantId} — Delete non-last variant`, 'DELETE', `/menuItemVariant/${secondVariantId}`);
  }

  // 16. *** PROPER GUARD TEST ***
  //     Chicken Biryani ALWAYS had exactly 1 variant and we never deleted any of its siblings.
  //     This is the cleanest possible test for the last-variant guard.
  if (singleVariantId) {
    await callApi(
      `DELETE /menuItemVariant/${singleVariantId} — GUARD: block delete of last variant (should reject)`,
      'DELETE',
      `/menuItemVariant/${singleVariantId}`,
      null,
      true // expectFail = true
    );
  }

  // ────────────────────────────────────────
  // USER TESTS
  // ────────────────────────────────────────
  console.log('\n━━━ USER ━━━');

  const uPhone = rPhone();
  const uEmail = `testuser${ts}@zomato.com`;

  // 17. Create user
  await callApi('POST /user — Create (valid)', 'POST', '/user', {
    userName: 'Shivansh Jaiswal',
    userEmail: uEmail,
    userPhoneNumber: uPhone
  });

  // 18. Duplicate email
  await callApi('POST /user — Duplicate email (should reject)', 'POST', '/user', {
    userName: 'Another User',
    userEmail: uEmail,
    userPhoneNumber: rPhone()
  }, true);

  // 19. Duplicate phone
  await callApi('POST /user — Duplicate phone (should reject)', 'POST', '/user', {
    userName: 'Yet Another',
    userEmail: `other${ts}@zomato.com`,
    userPhoneNumber: uPhone
  }, true);

  // 20. Invalid email
  await callApi('POST /user — Invalid email format (should reject)', 'POST', '/user', {
    userName: 'Bad Email',
    userEmail: 'notanemail',
    userPhoneNumber: rPhone()
  }, true);

  // 21. Invalid phone
  await callApi('POST /user — Invalid phone (starts with 1, should reject)', 'POST', '/user', {
    userName: 'Bad Phone',
    userEmail: `badphone${ts}@zomato.com`,
    userPhoneNumber: '1234567890'
  }, true);

  // ────────────────────────────────────────
  // CLEANUP
  // ────────────────────────────────────────
  console.log('\n━━━ CLEANUP ━━━');

  // Delete the second menu item (Chicken Biryani)
  const finalRest = await callApi(`GET /restaurant/${restaurantId} — Final fetch for cleanup`, 'GET', `/restaurant/${restaurantId}`);
  if (finalRest.ok && finalRest.data?.menuItemResponseDTOList?.length > 0) {
    for (const mi of finalRest.data.menuItemResponseDTOList) {
      await callApi(`DELETE /menuItem/${mi.menuItemId} — Cleanup`, 'DELETE', `/menuItem/${mi.menuItemId}`);
    }
  }

  // ────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────
  const total = pass + fail;
  console.log('\n═══════════════════════════════════════════════');
  console.log(`  RESULTS: ${pass}/${total} passed   ${fail > 0 ? `(${fail} failed)` : '🎉 ALL PASSED!'}`);
  console.log('═══════════════════════════════════════════════');
  if (fail > 0) {
    console.log('\nFailed tests:');
    RESULTS.filter(r => !r.passed).forEach(r => console.log(`  ❌ ${r.name}`));
  }
}

runTests();
