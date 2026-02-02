// IU Hub - Main Application

(function () {
  "use strict";

  // State
  let linksData = null;
  const VIEW_STORAGE_KEY = "iu-hub-view-mode";

  // DOM Elements
  const elements = {
    categoriesGrid: document.getElementById("categoriesGrid"),
    loading: document.getElementById("loading"),
    error: document.getElementById("error"),
    viewToggle: document.getElementById("viewToggle"),
    lastUpdated: document.getElementById("lastUpdated"),
    legacyLink: document.getElementById("legacyLink"),
    jsonFileLink: document.getElementById("jsonFileLink"),
  };

  // Initialize
  async function init() {
    loadViewPreference();
    setupEventListeners();
    await loadLinks();
  }

  // Load view preference from localStorage
  function loadViewPreference() {
    const isAdvanced = localStorage.getItem(VIEW_STORAGE_KEY) === "advanced";
    if (isAdvanced) {
      document.body.classList.add("advanced-view");
    }
  }

  // Save view preference to localStorage
  function saveViewPreference(isAdvanced) {
    localStorage.setItem(VIEW_STORAGE_KEY, isAdvanced ? "advanced" : "simple");
  }

  // Toggle view mode
  function toggleView() {
    const isAdvanced = document.body.classList.toggle("advanced-view");
    saveViewPreference(isAdvanced);
  }

  // Setup event listeners
  function setupEventListeners() {
    elements.viewToggle.addEventListener("click", toggleView);
  }

  // Load links from JSON
  async function loadLinks() {
    try {
      const response = await fetch("data/links.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      linksData = await response.json();
      renderCategories();
      updateFooter();
      elements.loading.hidden = true;
    } catch (err) {
      console.error("Failed to load links:", err);
      elements.loading.hidden = true;
      elements.error.hidden = false;
    }
  }

  // Render all categories with masonry layout
  function renderCategories() {
    const numColumns = window.innerWidth > 900 ? 3 : 1;

    // Create column containers
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      const col = document.createElement("div");
      col.className = "masonry-column";
      columns.push({ element: col, height: 0 });
    }

    // Estimate card heights based on item count and distribute to shortest column
    linksData.categories.forEach((category) => {
      const card = createCategoryCard(category);

      // Find shortest column
      const shortestCol = columns.reduce((min, col) =>
        col.height < min.height ? col : min,
      );

      shortestCol.element.appendChild(card);
      // Estimate height: header (60px) + items (50px each for simple, 90px for advanced)
      const itemHeight = category.items.some((i) => i.advanced) ? 70 : 50;
      shortestCol.height += 60 + category.items.length * itemHeight;
    });

    elements.categoriesGrid.innerHTML = "";
    columns.forEach((col) => elements.categoriesGrid.appendChild(col.element));
  }

  // Create a category card element
  function createCategoryCard(category) {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <div class="category-header">
        <span class="category-icon">${category.icon}</span>
        <h2 class="category-title">${escapeHtml(category.name)}</h2>
      </div>
      <div class="category-items">
        ${category.items.map((item) => createLinkItem(item)).join("")}
      </div>
    `;
    return card;
  }

  // Create a link item HTML
  function createLinkItem(item) {
    let advancedHtml = "";
    let subPagesHtml = "";

    // Advanced links (repo, datasheet, caching)
    if (item.advanced) {
      const advancedLinks = [];
      if (item.advanced.repo) {
        advancedLinks.push(
          `<a href="${escapeHtml(item.advanced.repo)}" class="advanced-link" target="_blank" rel="noopener"><span class="advanced-link-icon">📦</span> Repo</a>`,
        );
      }
      if (item.advanced.datasheet) {
        advancedLinks.push(
          `<a href="${escapeHtml(item.advanced.datasheet)}" class="advanced-link" target="_blank" rel="noopener"><span class="advanced-link-icon">📄</span> Sheet</a>`,
        );
      }
      if (item.advanced.cachingRepo) {
        advancedLinks.push(
          `<a href="${escapeHtml(item.advanced.cachingRepo)}" class="advanced-link" target="_blank" rel="noopener"><span class="advanced-link-icon">⚡</span> Cache</a>`,
        );
      }
      if (advancedLinks.length > 0) {
        advancedHtml = `<div class="link-advanced">${advancedLinks.join("")}</div>`;
      }
    }

    // Sub-pages (for ecosystems)
    if (item.subPages && item.subPages.length > 0) {
      const subPageLinks = item.subPages
        .map(
          (sub) =>
            `<a href="${escapeHtml(sub.url)}" class="sub-page-link" target="_blank" rel="noopener">${escapeHtml(sub.name)}</a>`,
        )
        .join("");
      subPagesHtml = `<div class="sub-pages">${subPageLinks}</div>`;
    }

    return `
      <div class="link-item">
        <div class="link-main">
          <a href="${escapeHtml(item.url)}" class="link-name" target="_blank" rel="noopener">${escapeHtml(item.name)}</a>
        </div>
        ${advancedHtml}
        ${subPagesHtml}
      </div>
    `;
  }

  // Update footer with data from JSON
  function updateFooter() {
    if (linksData.lastUpdated) {
      elements.lastUpdated.textContent = `Last updated: ${linksData.lastUpdated}`;
    }

    if (linksData.legacyPage) {
      elements.legacyLink.href = linksData.legacyPage.url;
      elements.legacyLink.textContent = linksData.legacyPage.name;
    }

    if (linksData.repoUrl) {
      elements.jsonFileLink.href = `${linksData.repoUrl}/blob/main/data/links.json`;
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Start the app
  document.addEventListener("DOMContentLoaded", init);
})();
