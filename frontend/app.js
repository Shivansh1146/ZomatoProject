/* ============================================================
   ZOMATO ADMIN PANEL — app.js
   Talks to Spring Boot backend at localhost:8080
   ============================================================ */

const BASE_URL = 'http://localhost:9090';

/* ────────────────────────────────────────
   SIDEBAR & NAVIGATION
   ──────────────────────────────────────── */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`nav-${page}`).classList.add('active');

  const labels = { restaurant: 'Add Restaurant', viewrestaurant: 'View Restaurant', menuitem: 'Add Menu Item' };
  document.getElementById('bc-current').textContent = labels[page];

  if (page === 'viewrestaurant') {
    fetchAllRestaurants();
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('menu-toggle');
  if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ────────────────────────────────────────
   API HEALTH CHECK
   ──────────────────────────────────────── */
async function checkApiStatus() {
  const dot  = document.querySelector('.status-dot');
  const text = document.getElementById('api-status-text');
  try {
    // Ping the known endpoint to see if the server responds
    const res = await fetch(`${BASE_URL}/restaurant`, { signal: AbortSignal.timeout(3000) });
    // Even if it returns 400 or something, if it responds with CORS headers, it's online.
    if (res.ok || res.status) {
      dot.className  = 'status-dot online';
      text.textContent = 'API Online';
    }
  } catch {
    dot.className  = 'status-dot offline';
    text.textContent = 'API Offline';
  }
}

checkApiStatus();
setInterval(checkApiStatus, 15000);

/* ────────────────────────────────────────
   TOAST NOTIFICATIONS
   ──────────────────────────────────────── */
function showToast(type, title, message) {
  const container = document.getElementById('toast-container');
  const id        = `toast-${Date.now()}`;
  const icon      = type === 'success' ? '✅' : '❌';

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id        = id;
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="removeToast('${id}')" aria-label="Close">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.animation = 'none';
    el.style.opacity   = '0';
    el.style.transform = 'translateX(24px)';
    el.style.transition = 'all 0.25s ease';
    setTimeout(() => el.remove(), 250);
  }
}

/* ────────────────────────────────────────
   FORM HELPERS
   ──────────────────────────────────────── */
function setError(fieldId, errorId, msg) {
  const el = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (el)  el.classList.add('invalid');
  if (err) err.textContent = msg;
}

function clearError(fieldId, errorId) {
  const el  = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (el)  el.classList.remove('invalid');
  if (err) err.textContent = '';
}

function clearAllErrors(errorIds) {
  errorIds.forEach(([f, e]) => clearError(f, e));
}

function setLoading(btnId, spinnerId, loading) {
  const btn     = document.getElementById(btnId);
  const spinner = document.getElementById(spinnerId);
  const label   = btn.querySelector('.btn-label');
  btn.disabled        = loading;
  spinner.classList.toggle('hidden', !loading);
  label.style.opacity = loading ? '0.5' : '1';
}

function resetForm(formId) {
  document.getElementById(formId).reset();
  document.querySelectorAll(`#${formId} .invalid`).forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll(`#${formId} .field-error`).forEach(el => el.textContent = '');
}

/* ────────────────────────────────────────
   RESTAURANT FORM — VALIDATION & SUBMIT
   ──────────────────────────────────────── */
const RESTAURANT_FIELDS = [
  ['r-name', 'err-r-name'],
  ['r-phone', 'err-r-phone'],
  ['r-street1', 'err-r-street1'],
  ['r-pincode', 'err-r-pincode'],
  ['r-state', 'err-r-state'],
  ['r-country', 'err-r-country'],
  ['r-lat', 'err-r-lat'],
  ['r-lng', 'err-r-lng'],
];

function validateRestaurant() {
  clearAllErrors(RESTAURANT_FIELDS);
  let valid = true;

  const name    = document.getElementById('r-name').value.trim();
  const phone   = document.getElementById('r-phone').value.trim();
  const street1 = document.getElementById('r-street1').value.trim();
  const pincode = document.getElementById('r-pincode').value.trim();
  const state   = document.getElementById('r-state').value.trim();
  const country = document.getElementById('r-country').value.trim();
  const lat     = document.getElementById('r-lat').value.trim();
  const lng     = document.getElementById('r-lng').value.trim();

  if (!name) {
    setError('r-name', 'err-r-name', 'Restaurant name is required'); valid = false;
  } else if (!/^[a-zA-Z ]+$/.test(name)) {
    setError('r-name', 'err-r-name', 'Letters and spaces only'); valid = false;
  }

  if (!phone) {
    setError('r-phone', 'err-r-phone', 'Phone number is required'); valid = false;
  } else if (!/^[6-9][0-9]{9}$/.test(phone)) {
    setError('r-phone', 'err-r-phone', 'Invalid phone number (10 digits, starts with 6–9)'); valid = false;
  }

  if (!street1) {
    setError('r-street1', 'err-r-street1', 'Street Line 1 is required'); valid = false;
  }

  if (!pincode) {
    setError('r-pincode', 'err-r-pincode', 'Pin code is required'); valid = false;
  } else if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    setError('r-pincode', 'err-r-pincode', 'Invalid pin code (6 digits, cannot start with 0)'); valid = false;
  }

  if (!state) {
    setError('r-state', 'err-r-state', 'State is required'); valid = false;
  } else if (!/^[a-zA-Z ]+$/.test(state)) {
    setError('r-state', 'err-r-state', 'Letters and spaces only'); valid = false;
  }

  if (!country) {
    setError('r-country', 'err-r-country', 'Country is required'); valid = false;
  } else if (!/^[a-zA-Z ]+$/.test(country)) {
    setError('r-country', 'err-r-country', 'Letters and spaces only'); valid = false;
  }

  if (lat === '') {
    setError('r-lat', 'err-r-lat', 'Latitude is required'); valid = false;
  } else if (isNaN(lat) || +lat < -90 || +lat > 90) {
    setError('r-lat', 'err-r-lat', 'Must be between -90 and 90'); valid = false;
  }

  if (lng === '') {
    setError('r-lng', 'err-r-lng', 'Longitude is required'); valid = false;
  } else if (isNaN(lng) || +lng < -180 || +lng > 180) {
    setError('r-lng', 'err-r-lng', 'Must be between -180 and 180'); valid = false;
  }

  return valid;
}

document.getElementById('form-restaurant').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateRestaurant()) return;

  setLoading('btn-restaurant-submit', 'spinner-restaurant', true);

  const payload = {
    restaurantName:        document.getElementById('r-name').value.trim(),
    restaurantPhoneNumber: document.getElementById('r-phone').value.trim(),
    streetLine1:           document.getElementById('r-street1').value.trim(),
    streetLine2:           document.getElementById('r-street2').value.trim() || null,
    pinCode:               document.getElementById('r-pincode').value.trim(),
    state:                 document.getElementById('r-state').value.trim(),
    country:               document.getElementById('r-country').value.trim(),
    latitude:              parseFloat(document.getElementById('r-lat').value),
    longitude:             parseFloat(document.getElementById('r-lng').value),
  };

  try {
    const res = await fetch(`${BASE_URL}/restaurant`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const text = await res.text();
    let errorMsg = text;
    try {
      const json = JSON.parse(text);
      if (json.message || json.error) errorMsg = json.message || json.error;
    } catch (e) {}

    if (res.status === 201 || res.ok) {
      showToast('success', 'Restaurant Added!', text || 'Restaurant registered successfully.');
      resetForm('form-restaurant');
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Something went wrong. Check your backend.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}. Is Spring Boot running?`);
  } finally {
    setLoading('btn-restaurant-submit', 'spinner-restaurant', false);
  }
});

/* ────────────────────────────────────────
   MENU ITEM — TYPE TOGGLE
   ──────────────────────────────────────── */
function selectType(type) {
  document.getElementById('m-type').value = type;
  document.getElementById('type-veg').classList.toggle('active', type === 'VEG');
  document.getElementById('type-nonveg').classList.toggle('active', type === 'NONVEG');
}

/* ────────────────────────────────────────
   MENU ITEM — VARIANTS
   ──────────────────────────────────────── */
let variantCount = 0;

function addVariant() {
  variantCount++;
  const idx       = variantCount;
  const container = document.getElementById('variants-container');

  const card = document.createElement('div');
  card.className = 'variant-card';
  card.id        = `variant-${idx}`;
  // Note: name, price, available, inventoryManaged are all @NotNull/@NotBlank in backend
  card.innerHTML = `
    <div class="variant-header">
      <span class="variant-title">Variant #${idx}</span>
      <button type="button" class="btn-remove-variant" onclick="removeVariant(${idx})">✕ Remove</button>
    </div>
    <div class="variant-grid">
      <div class="form-group">
        <label for="v${idx}-name">Variant Name <span class="req">*</span></label>
        <input type="text" id="v${idx}-name" placeholder="e.g. Large" autocomplete="off" />
        <span class="field-error" id="verr-${idx}-name"></span>
      </div>
      <div class="form-group">
        <label for="v${idx}-price">Price (₹) <span class="req">*</span></label>
        <input type="number" id="v${idx}-price" placeholder="e.g. 199" min="0.01" step="0.01" autocomplete="off" />
        <span class="field-hint">Must be greater than 0</span>
        <span class="field-error" id="verr-${idx}-price"></span>
      </div>
      <div class="form-group">
        <label>Available <span class="req">*</span></label>
        <label class="toggle-label">
          <input type="checkbox" id="v${idx}-available" checked />
          <span class="toggle-track"></span>
          <span id="v${idx}-available-text">Yes</span>
        </label>
      </div>
      <div class="form-group">
        <label>Manage Inventory <span class="req">*</span></label>
        <label class="toggle-label">
          <input type="checkbox" id="v${idx}-managed" />
          <span class="toggle-track"></span>
          <span id="v${idx}-managed-text">No</span>
        </label>
      </div>
      <div class="form-group col-full" id="v${idx}-inv-group" style="display:none;">
        <label for="v${idx}-inv">Available Inventory Count</label>
        <input type="number" id="v${idx}-inv" placeholder="e.g. 50" min="0" autocomplete="off" />
        <span class="field-hint">Cannot be negative</span>
        <span class="field-error" id="verr-${idx}-inv"></span>
      </div>
    </div>
  `;

  container.appendChild(card);

  // Toggle text labels and inventory field
  document.getElementById(`v${idx}-available`).addEventListener('change', function() {
    document.getElementById(`v${idx}-available-text`).textContent = this.checked ? 'Yes' : 'No';
  });
  document.getElementById(`v${idx}-managed`).addEventListener('change', function() {
    document.getElementById(`v${idx}-managed-text`).textContent = this.checked ? 'Yes' : 'No';
    document.getElementById(`v${idx}-inv-group`).style.display = this.checked ? 'flex' : 'none';
  });
}

function removeVariant(idx) {
  const el = document.getElementById(`variant-${idx}`);
  if (el) el.remove();
}

function collectVariants() {
  const variants = [];
  document.querySelectorAll('.variant-card').forEach(card => {
    const idx           = card.id.replace('variant-', '');
    const invManaged    = document.getElementById(`v${idx}-managed`)?.checked ?? false;
    const invRaw        = document.getElementById(`v${idx}-inv`)?.value;
    variants.push({
      menuVariantName:                document.getElementById(`v${idx}-name`)?.value.trim() || null,
      menuVariantPrice:               parseFloat(document.getElementById(`v${idx}-price`)?.value) || null,
      menuVariantAvailable:           document.getElementById(`v${idx}-available`)?.checked ?? true,
      inventoryManaged:               invManaged,
      currentAvailableInventoryCount: invManaged && invRaw !== '' ? parseInt(invRaw) : null,
    });
  });
  return variants;
}

/* Validate all variant cards — backend requires name, price (>0), available, inventoryManaged */
function validateVariants() {
  let valid = true;
  document.querySelectorAll('.variant-card').forEach(card => {
    const idx   = card.id.replace('variant-', '');
    const name  = document.getElementById(`v${idx}-name`)?.value.trim();
    const price = document.getElementById(`v${idx}-price`)?.value;
    const invManaged = document.getElementById(`v${idx}-managed`)?.checked;
    const invCount   = document.getElementById(`v${idx}-inv`)?.value;

    const nameErr  = document.getElementById(`verr-${idx}-name`);
    const priceErr = document.getElementById(`verr-${idx}-price`);
    const nameEl   = document.getElementById(`v${idx}-name`);
    const priceEl  = document.getElementById(`v${idx}-price`);
    const invEl    = document.getElementById(`v${idx}-inv`);
    let invErr     = document.getElementById(`verr-${idx}-inv`);

    // Clear previous
    if (nameErr)  nameErr.textContent  = '';
    if (priceErr) priceErr.textContent = '';
    if (invErr)   invErr.textContent   = '';
    if (nameEl)   nameEl.classList.remove('invalid');
    if (priceEl)  priceEl.classList.remove('invalid');
    if (invEl)    invEl.classList.remove('invalid');

    if (!name) {
      if (nameEl)  nameEl.classList.add('invalid');
      if (nameErr) nameErr.textContent = 'Variant name is required';
      valid = false;
    }
    if (!price || isNaN(price) || +price <= 0) {
      if (priceEl)  priceEl.classList.add('invalid');
      if (priceErr) priceErr.textContent = 'Price must be greater than 0';
      valid = false;
    }
    
    if (invManaged) {
      if (invCount === '' || invCount === null) {
        if (invEl)  invEl.classList.add('invalid');
        if (invErr) invErr.textContent = 'Inventory count required if managed';
        valid = false;
      } else if (+invCount < 0) {
        if (invEl)  invEl.classList.add('invalid');
        if (invErr) invErr.textContent = 'Cannot be negative';
        valid = false;
      }
    }
  });
  return valid;
}

/* ────────────────────────────────────────
   MENU ITEM FORM — VALIDATION & SUBMIT
   ──────────────────────────────────────── */
const MENUITEM_FIELDS = [
  ['m-name', 'err-m-name'],
  ['m-label', 'err-m-label'],
  ['m-description', 'err-m-description'],
  ['m-restaurant-id', 'err-m-restaurant-id'],
];

function validateMenuItem() {
  clearAllErrors(MENUITEM_FIELDS);
  let valid = true;

  const name         = document.getElementById('m-name').value.trim();
  const label        = document.getElementById('m-label').value.trim();
  const description  = document.getElementById('m-description').value.trim();
  const restaurantId = document.getElementById('m-restaurant-id').value.trim();

  // menuItemName — @NotBlank only (no @Pattern in updated backend)
  if (!name) {
    setError('m-name', 'err-m-name', 'Item name is required'); valid = false;
  }

  // menuItemLabel — still has @Pattern
  if (!label) {
    setError('m-label', 'err-m-label', 'Label is required'); valid = false;
  } else if (!/^[a-zA-Z ]+$/.test(label)) {
    setError('m-label', 'err-m-label', 'Letters and spaces only'); valid = false;
  }

  // menuItemDescription — @NotBlank only (no @Pattern in updated backend)
  if (!description) {
    setError('m-description', 'err-m-description', 'Description is required'); valid = false;
  }

  if (!restaurantId) {
    setError('m-restaurant-id', 'err-m-restaurant-id', 'Restaurant ID is required'); valid = false;
  } else if (isNaN(restaurantId) || +restaurantId < 1) {
    setError('m-restaurant-id', 'err-m-restaurant-id', 'Must be a valid positive number'); valid = false;
  }

  return valid;
}

document.getElementById('form-menuitem').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate both main form and all variant cards
  const mainValid    = validateMenuItem();
  const variantsValid = validateVariants();
  if (!mainValid || !variantsValid) return;

  setLoading('btn-menuitem-submit', 'spinner-menuitem', true);

  const variants = collectVariants();

  const payload = {
    menuItemName:                  document.getElementById('m-name').value.trim(),
    menuItemDescription:           document.getElementById('m-description').value.trim(),
    menuItemType:                  document.getElementById('m-type').value,
    menuItemLabel:                 document.getElementById('m-label').value.trim(),
    restaurantId:                  parseInt(document.getElementById('m-restaurant-id').value),
    // Backend iterates over this list — send null only if no variants added
    menuItemVariantRequestDTOList: variants.length > 0 ? variants : null,
  };

  try {
    const res  = await fetch(`${BASE_URL}/menuitem`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const text = await res.text();
    let errorMsg = text;
    try {
      const json = JSON.parse(text);
      if (json.message || json.error) errorMsg = json.message || json.error;
    } catch (e) {}

    if (res.status === 201) {
      showToast('success', 'Menu Item Added! 🍕', text || 'Menu item created successfully.');
      resetMenuItemForm();
    } else {
      showToast('error', `Backend Error ${res.status}`, errorMsg || 'Something went wrong on the server.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}. Is Spring Boot running?`);
  } finally {
    setLoading('btn-menuitem-submit', 'spinner-menuitem', false);
  }
});

function resetMenuItemForm() {
  resetForm('form-menuitem');
  selectType('VEG');
  document.getElementById('variants-container').innerHTML = '';
  variantCount = 0;
}

/* ────────────────────────────────────────
   REAL-TIME INLINE VALIDATION (on blur)
   ──────────────────────────────────────── */
document.addEventListener('blur', (e) => {
  if (!e.target.matches('input[type="text"], input[type="number"]')) return;
  const id = e.target.id;
  // Re-trigger the right validator only for the active form's fields
  if (id.startsWith('r-')) validateRestaurant();
  if (id.startsWith('m-') && !id.startsWith('m-type')) validateMenuItem();
}, true);

/* ────────────────────────────────────────
   VIEW RESTAURANT — FETCH & RENDER
   ──────────────────────────────────────── */
let currentViewRestaurantId = null;

document.getElementById('form-search-restaurant').addEventListener('submit', async (e) => {
  e.preventDefault();
  const idInput = document.getElementById('search-r-id');
  const id = idInput.value.trim();
  
  if (!id) return;

  setLoading('btn-search-restaurant', 'spinner-search', true);
  document.getElementById('restaurant-details-card').classList.add('hidden');

  try {
    const res = await fetch(`${BASE_URL}/restaurant/${id}`);
    
    if (res.ok) {
      const data = await res.json();
      currentViewRestaurantId = data.restaurantId || id;
      renderRestaurantDetails(data);
    } else if (res.status === 404) {
      showToast('error', 'Not Found', 'Restaurant not found with this ID.');
    } else {
      showToast('error', `Error ${res.status}`, 'Failed to fetch restaurant details.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}.`);
  } finally {
    setLoading('btn-search-restaurant', 'spinner-search', false);
  }
});

function renderRestaurantDetails(data) {
  document.getElementById('display-r-name').textContent = data.restaurantName;
  document.getElementById('display-r-phone').textContent = `+91 ${data.restaurantPhoneNumber}`;
  
  const address = [data.streetLine1, data.streetLine2, data.pinCode, data.state, data.country]
    .filter(p => p)
    .join(', ');
  document.getElementById('display-r-location').textContent = address;

  const menuItems = data.menuItemResponseDTOList || [];
  document.getElementById('display-m-count').textContent = menuItems.length;

  const listContainer = document.getElementById('display-m-list');
  listContainer.innerHTML = '';

  if (menuItems.length === 0) {
    listContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-dim); font-style: italic;">No menu items found.</div>`;
  } else {
    menuItems.forEach(item => {
      const variants = item.menuItemVariantResponseDTOList || [];
      const variantHtml = variants.map(v => 
        `<div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-card); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; color: var(--text-base); margin-right: 8px; margin-top: 8px; border: 1px solid var(--border); box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <span><strong>${v.menuVariantName}</strong> (₹${v.menuVariantPrice}) - <span style="color: ${v.menuVariantAvailable ? 'var(--green)' : 'var(--red)'};">${v.menuVariantAvailable ? 'Available' : 'Unavailable'}</span></span>
          <button type="button" onclick="openEditVariantModal(${v.menuVariantId}, ${item.menuItemId}, ${data.restaurantId || currentViewRestaurantId}, '${v.menuVariantName.replace(/'/g,"\\'")}', ${v.menuVariantPrice}, ${v.menuVariantAvailable})"
            style="background: var(--brand-light); border: 1px solid var(--brand); cursor: pointer; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; color: var(--brand); font-weight: 600; transition: all 0.2s;"
            onmouseover="this.style.background='var(--brand)';this.style.color='#fff';"
            onmouseout="this.style.background='var(--brand-light)';this.style.color='var(--brand)';" title="Edit this variant">✏️ Edit Variant</button>
        </div>`
      ).join('');

      const typeDot = item.menuItemType === 'VEG' 
        ? `<span class="veg-dot" style="display: inline-block;"></span>` 
        : `<span class="nonveg-dot" style="display: inline-block;"></span>`;

      const itemCard = document.createElement('div');
      itemCard.style.cssText = 'border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; background: var(--bg-hover); margin-bottom: 10px;';
      itemCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="flex:1;">
            <div style="font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; flex-wrap:wrap;">
              ${typeDot} ${item.menuItemName} 
              <span style="font-size: 0.65rem; background: var(--brand-light); color: var(--brand); padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${item.menuItemLabel}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">${item.menuItemDescription}</div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
            <button type="button" onclick="openEditModal(${item.menuItemId}, ${data.restaurantId || currentViewRestaurantId}, '${item.menuItemName.replace(/'/g,"\\'") }', '${item.menuItemDescription.replace(/'/g,"\\'")}', '${item.menuItemType}', '${item.menuItemLabel.replace(/'/g,"\\'")}')"
              style="padding: 4px 10px; font-size:0.75rem; background:var(--bg-card); border:1px solid var(--border); border-radius:6px; cursor:pointer; color:var(--text-base); font-weight:500; white-space:nowrap; transition: all 0.2s;"
              onmouseover="this.style.borderColor='var(--brand)';this.style.color='var(--brand)';"
              onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-base)';">✏️ Edit Item</button>
            <button type="button" onclick="deleteMenuItemApi(${item.menuItemId})"
              style="padding: 4px 10px; font-size:0.75rem; background:var(--bg-card); border:1px solid #fecaca; border-radius:6px; cursor:pointer; color:#dc2626; font-weight:500; white-space:nowrap; transition: all 0.2s;"
              onmouseover="this.style.background='#dc2626';this.style.color='#fff';"
              onmouseout="this.style.background='var(--bg-card)';this.style.color='#dc2626';">🗑️ Delete</button>
          </div>
        </div>
        <div style="margin-top: 6px;">${variantHtml}</div>
      `;
      listContainer.appendChild(itemCard);
    });
  }

  document.getElementById('restaurant-details-card').classList.remove('hidden');
}

function navigateToAddMenuItem() {
  if (currentViewRestaurantId) {
    document.getElementById('m-restaurant-id').value = currentViewRestaurantId;
  }
  showPage('menuitem');
}

/* ────────────────────────────────────────
   EDIT MENU ITEM MODAL
   ──────────────────────────────────────── */
function openEditModal(menuItemId, restaurantId, name, description, type, label) {
  document.getElementById('edit-menu-item-id').value = menuItemId;
  document.getElementById('edit-restaurant-id').value = restaurantId;
  document.getElementById('edit-m-name').value = name;
  document.getElementById('edit-m-description').value = description;
  document.getElementById('edit-m-type').value = type;
  document.getElementById('edit-m-label').value = label;

  // Clear any previous errors
  ['err-edit-m-name','err-edit-m-description','err-edit-m-label'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  const overlay = document.getElementById('edit-modal-overlay');
  overlay.style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-modal-overlay').style.display = 'none';
}

async function submitEditMenuItem() {
  const menuItemId  = document.getElementById('edit-menu-item-id').value;
  const restaurantId = document.getElementById('edit-restaurant-id').value;
  const name        = document.getElementById('edit-m-name').value.trim();
  const description = document.getElementById('edit-m-description').value.trim();
  const type        = document.getElementById('edit-m-type').value;
  const label       = document.getElementById('edit-m-label').value.trim();

  // Basic validation
  let valid = true;
  if (!name) { document.getElementById('err-edit-m-name').textContent = 'Name is required'; valid = false; }
  if (!description) { document.getElementById('err-edit-m-description').textContent = 'Description is required'; valid = false; }
  if (!label) { document.getElementById('err-edit-m-label').textContent = 'Label is required'; valid = false; }
  if (!valid) return;

  setLoading('btn-edit-submit', 'spinner-edit', true);

  const payload = {
    menuItemName: name,
    menuItemDescription: description,
    menuItemType: type,
    menuItemLabel: label,
    restaurantId: parseInt(restaurantId),
    menuItemVariantRequestDTOList: null,
  };

  try {
    const res = await fetch(`${BASE_URL}/menuitem/${menuItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (res.status === 201) {
      showToast('success', 'Menu Item Updated! ✅', text);
      closeEditModal();
      // Refresh the restaurant view to show updated data
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      showToast('error', `Error ${res.status}`, text || 'Update failed.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}.`);
  } finally {
    setLoading('btn-edit-submit', 'spinner-edit', false);
  }
}

/* ────────────────────────────────────────
   EDIT MENU ITEM VARIANT MODAL
   ──────────────────────────────────────── */
function openEditVariantModal(variantId, menuItemId, restaurantId, name, price, available) {
  document.getElementById('edit-variant-id').value = variantId;
  document.getElementById('edit-variant-menu-item-id').value = menuItemId;
  document.getElementById('edit-variant-restaurant-id').value = restaurantId;
  document.getElementById('edit-v-name').value = name;
  document.getElementById('edit-v-price').value = price;
  document.getElementById('edit-v-available').value = String(available);
  document.getElementById('edit-v-managed').value = 'true';
  document.getElementById('edit-v-count').value = '50';

  ['err-edit-v-name','err-edit-v-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  document.getElementById('edit-variant-modal-overlay').style.display = 'flex';
}

function closeEditVariantModal() {
  document.getElementById('edit-variant-modal-overlay').style.display = 'none';
}

async function submitEditVariant() {
  const variantId    = document.getElementById('edit-variant-id').value;
  const menuItemId   = document.getElementById('edit-variant-menu-item-id').value;
  const restaurantId = document.getElementById('edit-variant-restaurant-id').value;
  const name         = document.getElementById('edit-v-name').value.trim();
  const price        = parseFloat(document.getElementById('edit-v-price').value);
  const available    = document.getElementById('edit-v-available').value === 'true';
  const managed      = document.getElementById('edit-v-managed').value === 'true';
  const count        = parseInt(document.getElementById('edit-v-count').value) || 0;

  let valid = true;
  if (!name) { document.getElementById('err-edit-v-name').textContent = 'Variant name is required'; valid = false; }
  if (isNaN(price) || price <= 0) { document.getElementById('err-edit-v-price').textContent = 'Price must be greater than 0'; valid = false; }
  if (!valid) return;

  setLoading('btn-edit-variant-submit', 'spinner-edit-variant', true);

  const payload = {
    menuItemVariantRequestDTO: {
      menuVariantName: name,
      menuVariantPrice: price,
      menuVariantAvailable: available,
      inventoryManaged: managed,
      currentAvailableInventoryCount: count
    },
    menuItemId: parseInt(menuItemId),
    restaurantId: parseInt(restaurantId)
  };

  try {
    const res = await fetch(`${BASE_URL}/menuItemVariant/${variantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (res.status === 201) {
      showToast('success', 'Variant Updated! ✅', text);
      closeEditVariantModal();
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      showToast('error', `Error ${res.status}`, text || 'Variant update failed.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}.`);
  } finally {
    setLoading('btn-edit-variant-submit', 'spinner-edit-variant', false);
  }
}

/* ────────────────────────────────────────
   DELETE MENU ITEM
   ──────────────────────────────────────── */
async function deleteMenuItemApi(menuItemId) {
  if (!confirm('Are you sure you want to delete this menu item?')) return;

  try {
    const res = await fetch(`${BASE_URL}/menuItem/${menuItemId}`, {
      method: 'DELETE'
    });
    const text = await res.text();
    if (res.ok) {
      showToast('success', 'Menu Item Deleted! 🗑️', text);
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      showToast('error', `Error ${res.status}`, text || 'Delete failed.');
    }
  } catch (err) {
    showToast('error', 'Connection Failed', `Cannot reach backend at ${BASE_URL}.`);
  }
}


async function fetchAllRestaurants() {
  const tbody = document.getElementById('restaurants-tbody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;"><span class="btn-spinner" style="display:inline-block; border-color: var(--brand) transparent var(--brand) transparent;"></span> Loading...</td></tr>`;
  
  try {
    const res = await fetch(`${BASE_URL}/restaurant`);
    if (res.ok) {
      const data = await res.json();
      renderAllRestaurantsTable(data);
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--red);">Endpoint GET /restaurant not found or failed (HTTP ${res.status}). You must implement this in Spring Boot!</td></tr>`;
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--red);">Connection Failed. Is the backend running with GET /restaurant active?</td></tr>`;
  }
}

function renderAllRestaurantsTable(restaurants) {
  const tbody = document.getElementById('restaurants-tbody');
  if (!Array.isArray(restaurants) || restaurants.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No restaurants found.</td></tr>`;
    return;
  }

  tbody.innerHTML = restaurants.map(r => `
    <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
      <td style="padding: 12px 8px; font-weight: 500;">#${r.restaurantId}</td>
      <td style="padding: 12px 8px; font-weight: 600; color: var(--text-base);">${r.restaurantName}</td>
      <td style="padding: 12px 8px; color: var(--text-muted);">+91 ${r.restaurantPhoneNumber}</td>
      <td style="padding: 12px 8px; color: var(--text-muted);">${r.state || '-'}, ${r.country || '-'}</td>
      <td style="padding: 12px 8px; text-align: right;">
        <button type="button" class="btn-secondary" onclick="viewRestaurantFromTable(${r.restaurantId})" style="padding: 4px 8px; font-size: 0.75rem;">
          View Details
        </button>
      </td>
    </tr>
  `).join('');
}

function viewRestaurantFromTable(id) {
  document.getElementById('search-r-id').value = id;
  // Trigger form submit
  document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}
