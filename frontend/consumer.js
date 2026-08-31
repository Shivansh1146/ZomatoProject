const BASE_URL = 'http://localhost:9090';

// DOM Elements
const grid = document.getElementById('restaurant-grid');
const searchInput = document.getElementById('search-input');
const loading = document.getElementById('loading');
const overlay = document.getElementById('menu-overlay');
const menuContainer = document.getElementById('menu-items-container');
const toast = document.getElementById('toast');

let allRestaurants = [];

// Init
window.addEventListener('DOMContentLoaded', fetchRestaurants);

// Search Filter
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allRestaurants.filter(r => 
    r.restaurantName.toLowerCase().includes(term) ||
    (r.state && r.state.toLowerCase().includes(term))
  );
  renderRestaurants(filtered);
});

async function fetchRestaurants() {
  try {
    const res = await fetch(`${BASE_URL}/restaurant`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    allRestaurants = data || [];
    loading.style.display = 'none';
    renderRestaurants(allRestaurants);
  } catch (err) {
    console.error(err);
    loading.innerHTML = `Failed to load restaurants. Is the backend running?`;
  }
}

function renderRestaurants(restaurants) {
  if (restaurants.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No restaurants found</h3>
        <p>Try searching for something else!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = restaurants.map(r => {
    // Generate a consistent pseudo-random image for demo
    const imgId = r.restaurantId % 20 + 20; 
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    
    return `
      <div class="restaurant-card" onclick="openMenu(${r.restaurantId})">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80&sig=${imgId}" alt="${r.restaurantName}" class="r-image" />
        <div class="r-info">
          <div class="r-header">
            <h3 class="r-name">${r.restaurantName}</h3>
            <div class="r-rating">${rating} ★</div>
          </div>
          <div class="r-meta">
            <span>North Indian, Fast Food</span>
            <span>₹250 for one</span>
          </div>
          <div style="color:var(--text-muted); font-size: 0.85rem; border-top: 1px solid var(--border); padding-top: 12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
             📍 ${r.streetLine1 || ''} ${r.state ? ', ' + r.state : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function openMenu(id) {
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  menuContainer.innerHTML = '';
  document.getElementById('m-loading').style.display = 'block';

  try {
    const res = await fetch(`${BASE_URL}/restaurant/${id}`);
    if (!res.ok) throw new Error('Failed to fetch restaurant');
    const data = await res.json();
    
    document.getElementById('m-loading').style.display = 'none';
    document.getElementById('m-name').textContent = data.restaurantName;
    document.getElementById('m-address').textContent = `${data.streetLine1 || ''}, ${data.pinCode || ''} | ${data.restaurantPhoneNumber || ''}`;
    
    renderMenu(data.menuItemResponseDTOList || []);
  } catch (err) {
    console.error(err);
    document.getElementById('m-loading').textContent = 'Failed to load menu.';
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
        <h3>This restaurant hasn't added a menu yet</h3>
        <p>Check back later!</p>
      </div>
    `;
    return;
  }

  menuContainer.innerHTML = items.map(item => {
    const isVeg = item.menuItemType === 'VEG';
    const svgIcon = isVeg 
      ? `<svg class="mi-type-icon" viewBox="0 0 24 24" fill="none" stroke="#1E8449" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="5" fill="#1E8449" stroke="none"/></svg>`
      : `<svg class="mi-type-icon" viewBox="0 0 24 24" fill="none" stroke="#E23744" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7l4 8H8z" fill="#E23744" stroke="none"/></svg>`;
    
    const variants = item.menuItemVariantResponseDTOList || [];
    const price = variants.length > 0 ? variants[0].menuVariantPrice : 'N/A';
    
    // Add "Bestseller" label if it exists in the DB
    const label = item.menuItemLabel ? `<span style="background:#FDF2E9;color:#D35400;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:700;margin-left:8px;vertical-align:middle;">⭐ ${item.menuItemLabel}</span>` : '';

    return `
      <div class="menu-item">
        <div class="mi-details">
          ${svgIcon}
          <h4 class="mi-name">${item.menuItemName} ${label}</h4>
          <div class="mi-price">₹${price}</div>
          <p class="mi-desc">${item.menuItemDescription || ''}</p>
        </div>
        <div class="mi-image-container">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" alt="${item.menuItemName}" class="mi-image" />
          <button class="btn-add" onclick="addToCart()">ADD</button>
        </div>
      </div>
    `;
  }).join('');
}

let toastTimeout;
function addToCart() {
  toast.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    Cart API not yet available in backend!
  `;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
