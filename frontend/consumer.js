const BASE_URL = 'http://localhost:9090';

// ─────────────────────────────────────────────────────────
//  IMAGE LIBRARY — Correct images for each restaurant/item
//  Using Unsplash food photography with specific topic IDs
// ─────────────────────────────────────────────────────────
const RESTAURANT_IMAGES = {
  "domino":   "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80",  // Pizza
  "pizza":    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80",
  "haldiram": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=700&q=80",  // Indian sweets/snacks
  "behrouz":  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80",  // Biryani
  "biryani":  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80",
  "default":  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80",  // Restaurant interior
};

const MENU_ITEM_IMAGES = {
  // Pizza
  "margherita":           "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "pepper barbecue":      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "pizza":                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  // Indian
  "chole bhature":        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "raj kachori":          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "kachori":              "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "chole":                "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  // Biryani
  "biryani":              "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "dum gosht":            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  // Generics
  "chicken":              "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400&q=80",
  "paneer":               "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
  "burger":               "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "pasta":                "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "noodles":              "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
  "sandwich":             "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80",
  "salad":                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "dessert":              "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "sweet":                "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "default":              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",  // Generic food
};

function getRestaurantImage(name = '') {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(RESTAURANT_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return RESTAURANT_IMAGES.default;
}

function getMenuItemImage(name = '') {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(MENU_ITEM_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return MENU_ITEM_IMAGES.default;
}

// ─────────────────────────────────────────────────────────
//  APP LOGIC
// ─────────────────────────────────────────────────────────
const grid = document.getElementById('restaurant-grid');
const searchInput = document.getElementById('search-input');
const loading = document.getElementById('loading');
const overlay = document.getElementById('menu-overlay');
const menuContainer = document.getElementById('menu-items-container');
const toast = document.getElementById('toast');

let allRestaurants = [];

window.addEventListener('DOMContentLoaded', fetchRestaurants);

let activeFilter = 'all';

function setFilter(filter, el) {
  activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  // Re-run the current search with the new filter
  const term = searchInput.value.toLowerCase();
  applyFilter(term);
}

searchInput.addEventListener('input', (e) => {
  applyFilter(e.target.value.toLowerCase());
});

function applyFilter(term) {
  let filtered = allRestaurants.filter(r =>
    r.restaurantName.toLowerCase().includes(term) ||
    (r.state && r.state.toLowerCase().includes(term)) ||
    (r.streetLine1 && r.streetLine1.toLowerCase().includes(term))
  );
  renderRestaurants(filtered);
}

async function fetchRestaurants() {
  try {
    const res = await fetch(`${BASE_URL}/restaurant`);
    if (!res.ok) throw new Error('Backend unreachable');
    const data = await res.json();
    allRestaurants = data || [];
    loading.style.display = 'none';
    document.getElementById('section-title').style.display = 'flex';
    renderRestaurants(allRestaurants);
  } catch (err) {
    loading.innerHTML = `<span style="color:#E23744;">⚠ Could not reach backend at ${BASE_URL}. Is the Spring Boot app running?</span>`;
  }
}

function renderRestaurants(restaurants) {
  const badge = document.getElementById('count-badge');
  if (badge) badge.textContent = restaurants.length;

  if (!restaurants || restaurants.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div style="font-size:3rem;margin-bottom:16px;">🍽️</div>
        <h3>No restaurants found</h3>
        <p>Try a different search term.</p>
      </div>`;
    return;
  }

  grid.innerHTML = restaurants.map(r => {
    const img = getRestaurantImage(r.restaurantName);
    const rating = ((r.restaurantId * 7 + 33) % 15 / 10 + 3.5).toFixed(1);
    const location = [r.streetLine1, r.state].filter(Boolean).join(', ');
    const offers = ['20% off up to ₹100', 'Free delivery', '₹50 off on first order', '30% off on combo'];
    const offer = offers[r.restaurantId % offers.length];

    return `
      <div class="restaurant-card" onclick="openMenu(${r.restaurantId}, '${r.restaurantName.replace(/'/g, "\\'")}')">
        <div class="r-img-wrap">
          <img src="${img}" alt="${r.restaurantName}" class="r-image" loading="lazy"
               onerror="this.src='${RESTAURANT_IMAGES.default}'" />
          <div class="r-img-overlay"></div>
          <div class="r-offer-tag">🏷️ ${offer}</div>
        </div>
        <div class="r-info">
          <div class="r-header">
            <h3 class="r-name">${r.restaurantName}</h3>
            <div class="r-rating">★ ${rating}</div>
          </div>
          <div class="r-meta">
            <span class="r-cuisine">Indian Cuisine</span>
            <span class="r-dot">•</span>
            <span>30–40 min</span>
            <span class="r-dot">•</span>
            <span>₹200 for one</span>
          </div>
          <div class="r-location">📍 ${location}</div>
        </div>
      </div>`;
  }).join('');
}

async function openMenu(id, name) {
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  menuContainer.innerHTML = '';
  document.getElementById('m-loading').style.display = 'block';
  document.getElementById('m-name').textContent = name;
  document.getElementById('m-address').textContent = 'Loading...';

  try {
    const res = await fetch(`${BASE_URL}/restaurant/${id}`);
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();

    document.getElementById('m-loading').style.display = 'none';
    document.getElementById('m-name').textContent = data.restaurantName;
    document.getElementById('m-address').textContent =
      [data.streetLine1, data.streetLine2, data.state, data.pinCode].filter(Boolean).join(', ')
      + (data.restaurantPhoneNumber ? ` | 📞 +91 ${data.restaurantPhoneNumber}` : '');

    // Update menu hero image
    const heroEl = document.getElementById('menu-hero-img');
    if (heroEl) heroEl.src = getRestaurantImage(data.restaurantName);

    renderMenu(data.menuItemResponseDTOList || []);
  } catch (err) {
    document.getElementById('m-loading').textContent = '⚠ Failed to load menu. Please try again.';
  }
}

function closeMenu() {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function renderMenu(items) {
  if (items.length === 0) {
    menuContainer.innerHTML = `
      <div class="empty-state">
        <div style="font-size:3rem;margin-bottom:16px;">🫙</div>
        <h3>No menu items yet</h3>
        <p>The restaurant hasn't added items yet.</p>
      </div>`;
    return;
  }

  // Separate veg and non-veg
  const veg    = items.filter(i => i.menuItemType === 'VEG');
  const nonVeg = items.filter(i => i.menuItemType !== 'VEG');

  const buildSection = (sectionItems, title, icon) => {
    if (!sectionItems.length) return '';
    return `
      <div class="menu-section">
        <h3 class="menu-section-title">${icon} ${title} <span>(${sectionItems.length})</span></h3>
        ${sectionItems.map(item => buildMenuItemCard(item)).join('')}
      </div>`;
  };

  menuContainer.innerHTML = buildSection(veg, 'Veg', '🟢') + buildSection(nonVeg, 'Non-Veg', '🔴');
}

function buildMenuItemCard(item) {
  const variants = item.menuItemVariantResponseDTOList || [];
  const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.menuVariantPrice)) : null;
  const img = getMenuItemImage(item.menuItemName);
  const isVeg = item.menuItemType === 'VEG';

  const typeSvg = isVeg
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="5" fill="#1E8449" stroke="none"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E23744" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7l4 8H8z" fill="#E23744" stroke="none"/></svg>`;

  const labelHtml = item.menuItemLabel
    ? `<span class="mi-badge">${item.menuItemLabel}</span>` : '';

  const variantHtml = variants.length > 1
    ? `<div class="mi-variants">${variants.map(v =>
        `<span class="mi-variant-tag">${v.menuVariantName} — <strong>₹${v.menuVariantPrice}</strong></span>`
      ).join('')}</div>`
    : '';

  return `
    <div class="menu-item">
      <div class="mi-details">
        <div class="mi-top">${typeSvg} ${labelHtml}</div>
        <h4 class="mi-name">${item.menuItemName}</h4>
        <p class="mi-desc">${item.menuItemDescription || ''}</p>
        ${minPrice !== null ? `<div class="mi-price">₹${minPrice}${variants.length > 1 ? ' <span class="mi-onwards">onwards</span>' : ''}</div>` : ''}
        ${variantHtml}
      </div>
      <div class="mi-image-container">
        <img src="${img}" alt="${item.menuItemName}" class="mi-image"
             onerror="this.src='${MENU_ITEM_IMAGES.default}'" loading="lazy"/>
        <button class="btn-add" onclick="showCartToast(event)">ADD</button>
      </div>
    </div>`;
}

let toastTimeout;
function showCartToast(e) {
  e.stopPropagation();
  toast.innerHTML = `🛒 Cart feature coming soon! (No Cart API in backend yet)`;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
