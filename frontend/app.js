/* ============================================================
   ZOMATO ADMIN PANEL — app.js
   Talks to Spring Boot backend at localhost:9090
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
    const res  = await fetch(`${BASE_URL}/menuItem`, {
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
const variantStateCache = {}; // Cache for variant inventory settings (managed & count)

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
      const text = await res.text();
      if (!text.trim()) {
        showToast('error', 'Not Found', 'Restaurant not found with this ID.');
        return;
      }
      const data = JSON.parse(text);
      currentViewRestaurantId = data.restaurantId || id;
      renderRestaurantDetails(data);
      showToast('success', 'Found!', `Loaded details for ${data.restaurantName}`);
    } else if (res.status === 404) {
      showToast('error', 'Not Found', 'Restaurant not found with this ID.');
    } else {
      showToast('error', `Error ${res.status}`, 'Failed to fetch restaurant details.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
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
  
  const createdTime = data.userAccountCreatedTime || data.createdAt || data.createdTime;
  const createdHtml = createdTime ? `<div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Created: ${new Date(createdTime).toLocaleString()}</div>` : '';
  document.getElementById('display-r-location').insertAdjacentHTML('afterend', createdHtml);

  const menuItems = data.menuItemResponseDTOList || [];
  document.getElementById('display-m-count').textContent = `${menuItems.length} items`;

  const listContainer = document.getElementById('display-m-list');
  listContainer.innerHTML = '';

  if (menuItems.length === 0) {
    listContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-dim); font-style: italic;">No menu items found.</div>`;
  } else {
    menuItems.forEach(item => {
      const variants = item.menuItemVariantResponseDTOList || [];
      const variantHtml = variants.map(v => {
        const cached = variantStateCache[v.menuVariantId] || {};
        const isManaged = cached.managed !== undefined ? cached.managed : (v.inventoryManaged !== undefined ? v.inventoryManaged : true);
        const stockCount = cached.count !== undefined ? cached.count : (v.currentAvailableInventoryCount || 50);
        const stockBadge = isManaged ? `<span style="font-size:0.7rem; color:var(--text-muted); margin-left:8px; font-weight:500;">📦 ${stockCount} left</span>` : ``;

        const vCreatedTime = v.userAccountCreatedTime || v.createdAt || v.createdTime;
        const vCreatedHtml = vCreatedTime ? `<span style="font-size: 0.7rem; color: var(--text-dim); display:block; margin-top:2px;">Added: ${new Date(vCreatedTime).toLocaleDateString()}</span>` : '';

        return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border);">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${v.menuVariantName}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">₹${v.menuVariantPrice} ${stockBadge}</span>
            ${vCreatedHtml}
          </div>
          <button type="button" onclick="openEditVariantModal(${v.menuVariantId}, ${item.menuItemId}, ${data.restaurantId || currentViewRestaurantId}, '${v.menuVariantName.replace(/'/g,"\\'")}', ${v.menuVariantPrice}, ${v.menuVariantAvailable}, ${isManaged}, ${stockCount})"
            style="background: #fff; border: 1px solid var(--border-input); border-radius: 8px; padding: 6px 14px; font-weight: 700; color: var(--brand); font-size: 0.75rem; cursor: pointer; box-shadow: var(--shadow-sm); text-transform: uppercase; transition: all 0.2s;"
            onmouseover="this.style.background='var(--brand-light)';" onmouseout="this.style.background='#fff';">Edit</button>
          <button type="button" onclick="deleteVariantApi(${v.menuVariantId})"
            style="background: #fff; border: 1px solid #fecaca; border-radius: 8px; padding: 6px 14px; font-weight: 700; color: #dc2626; font-size: 0.75rem; cursor: pointer; box-shadow: var(--shadow-sm); text-transform: uppercase; transition: all 0.2s; margin-left: 6px;"
            onmouseover="this.style.background='#dc2626';this.style.color='#fff';" onmouseout="this.style.background='#fff';this.style.color='#dc2626';">Delete</button>
        </div>`;
      }).join('');

      const typeSvg = item.menuItemType === 'VEG' 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="5" fill="#1E8449" stroke="none"/></svg>` 
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E23744" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7l4 8H8z" fill="#E23744" stroke="none"/></svg>`;

      const labelBadge = item.menuItemLabel ? `<span style="background: var(--brand-light); color: var(--brand); padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${item.menuItemLabel}</span>` : '';

      const iCreatedTime = item.userAccountCreatedTime || item.createdAt || item.createdTime;
      const iCreatedHtml = iCreatedTime ? `<div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 8px;">Created: ${new Date(iCreatedTime).toLocaleString()}</div>` : '';

      const itemCard = document.createElement('div');
      itemCard.style.cssText = 'border-bottom: 1px solid var(--border); padding-bottom: 32px; display: flex; flex-direction: column; gap: 16px;';
      itemCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              ${typeSvg}
              ${labelBadge}
            </div>
            <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${item.menuItemName}</h4>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">₹${variants.length > 0 ? variants[0].menuVariantPrice : '0'} <span style="font-size:0.75rem; color:var(--text-dim); font-weight:400;">(starts at)</span></div>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; max-width: 480px;">${item.menuItemDescription}</p>
            ${iCreatedHtml}
          </div>
          <div style="width: 140px; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 140px; height: 140px; background: var(--bg-hover); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); position: relative; margin-bottom: 12px;">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" alt="Food" style="width:100%; height:100%; object-fit:cover;" />
              <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);">
                 <button type="button" onclick="openEditModal(${item.menuItemId}, ${data.restaurantId || currentViewRestaurantId}, '${item.menuItemName.replace(/'/g,"\\'")}', '${item.menuItemDescription.replace(/'/g,"\\'")}', '${item.menuItemType}', '${item.menuItemLabel.replace(/'/g,"\\'")}')" style="background: #fff; color: var(--green); border: 1px solid var(--border-input); font-weight: 800; padding: 6px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; transition: transform 0.1s;">EDIT</button>
              </div>
            </div>
            <button type="button" onclick="deleteMenuItemApi(${item.menuItemId})" style="background: none; border: none; color: var(--text-dim); font-size: 0.75rem; text-decoration: underline; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--text-dim)'">Delete Item</button>
          </div>
        </div>
        ${variants.length > 0 ? `
        <div style="background: var(--bg-base); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; margin-top: 8px;">
          <div style="padding: 12px 16px; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); border-bottom: 1px solid var(--border); background: #fbfbfb;">
            Manage Variants
          </div>
          <div>${variantHtml}</div>
        </div>
        ` : ''}
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
    const res = await fetch(`${BASE_URL}/menuItem/${menuItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let errorMsg = text;
    try { const json = JSON.parse(text); if (json.message || json.error) errorMsg = json.message || json.error; } catch (e) {}
    
    if (res.status === 201 || res.status === 200) {
      showToast('success', 'Menu Item Updated! ✅', text || 'Menu item updated successfully.');
      closeEditModal();
      // Refresh the restaurant view to show updated data
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Update failed.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
  } finally {
    setLoading('btn-edit-submit', 'spinner-edit', false);
  }
}

/* ────────────────────────────────────────
   EDIT MENU ITEM VARIANT MODAL
   ──────────────────────────────────────── */
function toggleEditVariantInventory() {
  const isManaged = document.getElementById('edit-v-managed').value === 'true';
  const countInput = document.getElementById('edit-v-count');
  if (!isManaged) {
    countInput.value = '0';
    countInput.disabled = true;
    countInput.style.opacity = '0.5';
    countInput.style.cursor = 'not-allowed';
  } else {
    countInput.disabled = false;
    countInput.style.opacity = '1';
    countInput.style.cursor = 'auto';
    if (!countInput.value || countInput.value === '0') {
      countInput.value = '50';
    }
  }
}

function openEditVariantModal(variantId, menuItemId, restaurantId, name, price, available, managed = true, count = 50) {
  document.getElementById('edit-variant-id').value = variantId;
  document.getElementById('edit-variant-menu-item-id').value = menuItemId;
  document.getElementById('edit-variant-restaurant-id').value = restaurantId;
  document.getElementById('edit-v-name').value = name;
  document.getElementById('edit-v-price').value = price;
  document.getElementById('edit-v-available').value = String(available);
  document.getElementById('edit-v-managed').value = String(managed);
  document.getElementById('edit-v-count').value = count;

  toggleEditVariantInventory();

  ['err-edit-v-name','err-edit-v-price','err-edit-v-count'].forEach(id => {
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
  const countVal     = parseInt(document.getElementById('edit-v-count').value);

  ['err-edit-v-name','err-edit-v-price','err-edit-v-count'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  let valid = true;
  if (!name) { document.getElementById('err-edit-v-name').textContent = 'Variant name is required'; valid = false; }
  if (isNaN(price) || price <= 0) { document.getElementById('err-edit-v-price').textContent = 'Price must be greater than 0'; valid = false; }
  if (managed && (isNaN(countVal) || countVal < 0)) {
    document.getElementById('err-edit-v-count').textContent = 'Stock count cannot be empty or negative when inventory is managed';
    valid = false;
  }
  if (!valid) return;

  const count = managed ? countVal : 0;

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
    let errorMsg = text;
    try { const json = JSON.parse(text); if (json.message || json.error) errorMsg = json.message || json.error; } catch (e) {}

    if (res.status === 201 || res.status === 200) {
      variantStateCache[variantId] = { managed, count };
      showToast('success', 'Variant Updated! ✅', text || 'Variant updated successfully.');
      closeEditVariantModal();
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Variant update failed.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
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
    let errorMsg = text;
    try { const json = JSON.parse(text); if (json.message || json.error) errorMsg = json.message || json.error; } catch (e) {}

    if (res.ok) {
      showToast('success', 'Menu Item Deleted! 🗑️', text || 'Menu item successfully deleted.');
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else if (res.status === 404) {
      showToast('error', 'Not Found', 'Menu item not found or already deleted.');
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Delete failed.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
  }
}


async function fetchAllRestaurants() {
  const tbody = document.getElementById('restaurants-tbody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;"><span class="btn-spinner" style="display:inline-block; border-color: var(--brand) transparent var(--brand) transparent;"></span> Loading...</td></tr>`;
  
  try {
    const res = await fetch(`${BASE_URL}/restaurant`);
    if (res.ok) {
      const text = await res.text();
      if (!text.trim()) {
        renderAllRestaurantsTable([]);
        showToast('info', 'No Data', 'No restaurants found in the database.');
      } else {
        const data = JSON.parse(text);
        renderAllRestaurantsTable(data);
        showToast('success', 'Refreshed', `Loaded ${data.length} restaurants.`);
      }
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--red);">Endpoint GET /restaurant not found or failed (HTTP ${res.status}). You must implement this in Spring Boot!</td></tr>`;
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--red);">Error: ${err.message || 'Connection Failed'}</td></tr>`;
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
      <td style="padding: 12px 8px; text-align: right; display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
        <button type="button" class="btn-secondary" onclick="viewRestaurantFromTable(${r.restaurantId})" style="padding: 4px 10px; font-size: 0.75rem;">
          View Details
        </button>
        <button type="button" onclick="deleteRestaurantApi(${r.restaurantId})" style="padding: 4px 10px; font-size: 0.75rem; background: #fff; border: 1px solid #fecaca; border-radius: 6px; cursor: pointer; color: #dc2626; font-weight: 600; transition: all 0.2s;"
          onmouseover="this.style.background='#dc2626';this.style.color='#fff';" onmouseout="this.style.background='#fff';this.style.color='#dc2626';">
          🗑️ Delete
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

/* ────────────────────────────────────────
   DELETE RESTAURANT
   ──────────────────────────────────────── */
async function deleteRestaurantApi(restaurantId) {
  if (!confirm(`Are you sure you want to delete Restaurant #${restaurantId}? This will also delete all its menu items and variants!`)) return;

  try {
    const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, { method: 'DELETE' });
    const text = await res.text();
    let errorMsg = text;
    try { const json = JSON.parse(text); if (json.message || json.error) errorMsg = json.message || json.error; } catch (e) {}

    if (res.ok) {
      showToast('success', 'Restaurant Deleted! 🗑️', text || 'Successfully deleted the restaurant.');
      // Hide the details card if the deleted restaurant was being viewed
      if (String(currentViewRestaurantId) === String(restaurantId)) {
        document.getElementById('restaurant-details-card').classList.add('hidden');
        currentViewRestaurantId = null;
      }
      fetchAllRestaurants();
    } else if (res.status === 404) {
      showToast('error', 'Not Found', 'Restaurant not found or already deleted.');
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Delete failed.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
  }
}

/* ────────────────────────────────────────
   DELETE MENU ITEM VARIANT
   ──────────────────────────────────────── */
async function deleteVariantApi(variantId) {
  if (!confirm('Are you sure you want to delete this variant?')) return;

  try {
    const res = await fetch(`${BASE_URL}/menuItemVariant/${variantId}`, { method: 'DELETE' });
    const text = await res.text();
    let errorMsg = text;
    try { const json = JSON.parse(text); if (json.message || json.error) errorMsg = json.message || json.error; } catch (e) {}

    if (res.ok) {
      // Remove from cache
      delete variantStateCache[variantId];
      showToast('success', 'Variant Deleted! 🗑️', text || 'Variant successfully deleted.');
      // Refresh the current restaurant view
      document.getElementById('form-search-restaurant').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else if (res.status === 404) {
      showToast('error', 'Not Found', 'Variant not found or already deleted.');
    } else {
      showToast('error', `Error ${res.status}`, errorMsg || 'Delete failed.');
    }
  } catch (err) {
    console.error(err);
    showToast('error', 'Error Occurred', err.message || `Cannot reach backend at ${BASE_URL}.`);
  }
}
