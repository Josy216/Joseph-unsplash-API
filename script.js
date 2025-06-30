
const accessKey = "DFHs_glgSAUwUgy1iPKxFQK1YLySIUTXIavr06yVju8";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreButton = document.getElementById("show-more");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error-message");
const noResultsElement = document.getElementById("no-results");

let keyword = "";
let page = 1;
let totalPages = 0;

// Initialize Lucide icons
function initializeIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Show/hide elements
function showElement(element) {
  if (element) element.style.display = "block";
}

function hideElement(element) {
  if (element) element.style.display = "none";
}

// Show loading state
function showLoading(isLoadMore = false) {
  if (!isLoadMore) {
    showElement(loadingElement);
    hideElement(errorElement);
    hideElement(noResultsElement);
  }
  
  // Show loading icon in button
  const buttonText = document.querySelector(isLoadMore ? "#show-more .button-text" : ".search-button .button-text");
  const loadingIcon = document.querySelector(isLoadMore ? "#show-more .loading-icon" : ".search-button .loading-icon");
  
  if (buttonText) buttonText.style.display = "none";
  if (loadingIcon) showElement(loadingIcon);
  
  // Disable buttons
  const searchButton = document.querySelector(".search-button");
  if (searchButton) searchButton.disabled = true;
  if (showMoreButton) showMoreButton.disabled = true;
}

// Hide loading state
function hideLoading(isLoadMore = false) {
  if (!isLoadMore) {
    hideElement(loadingElement);
  }
  
  // Hide loading icon in button
  const buttonText = document.querySelector(isLoadMore ? "#show-more .button-text" : ".search-button .button-text");
  const loadingIcon = document.querySelector(isLoadMore ? "#show-more .loading-icon" : ".search-button .loading-icon");
  
  if (buttonText) buttonText.style.display = "inline";
  if (loadingIcon) hideElement(loadingIcon);
  
  // Enable buttons
  const searchButton = document.querySelector(".search-button");
  if (searchButton) searchButton.disabled = false;
  if (showMoreButton) showMoreButton.disabled = false;
}

// Create image card
function createImageCard(result) {
  const imageCard = document.createElement("div");
  imageCard.className = "image-card";
  
  const image = document.createElement("img");
  image.src = result.urls.regular;
  image.alt = result.alt_description || "Unsplash Image";
  image.loading = "lazy";
  
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  
  const photographerName = document.createElement("p");
  photographerName.className = "photographer-name";
  photographerName.textContent = result.user.name;
  
  const location = document.createElement("p");
  location.className = "image-location";
  location.textContent = result.location?.title || "Unknown";
  
  overlay.appendChild(photographerName);
  overlay.appendChild(location);
  
  imageCard.appendChild(image);
  imageCard.appendChild(overlay);
  
  // Add click handler for download
  imageCard.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = result.urls.full;
    link.download = `unsplash-${result.id}.jpg`;
    link.click();
  });
  
  return imageCard;
}

// Search images
async function searchImages(isLoadMore = false) {
  if (!isLoadMore) {
    keyword = searchBox.value.trim();
    if (!keyword) return;
    page = 1;
  }

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  try {
    showLoading(isLoadMore);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    totalPages = data.total_pages;

    if (page === 1) {
      searchResult.innerHTML = "";
      hideElement(noResultsElement);
      hideElement(errorElement);
    }

    const results = data.results;

    if (results.length === 0 && page === 1) {
      showElement(noResultsElement);
      hideElement(showMoreButton);
    } else {
      hideElement(noResultsElement);
      
      results.forEach((result) => {
        const imageCard = createImageCard(result);
        searchResult.appendChild(imageCard);
      });

      // Show/hide "Show More" button
      if (page < totalPages) {
        showElement(showMoreButton);
      } else {
        hideElement(showMoreButton);
      }
    }

  } catch (error) {
    console.error("Error fetching images:", error);
    
    if (page === 1) {
      showElement(errorElement);
      hideElement(noResultsElement);
      searchResult.innerHTML = "";
    }
    
    hideElement(showMoreButton);
  } finally {
    hideLoading(isLoadMore);
    initializeIcons(); // Reinitialize icons after DOM changes
  }
}

// Event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchImages();
});

showMoreButton.addEventListener("click", () => {
  page++;
  searchImages(true);
});

// Initialize icons on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeIcons();
  
  // Show initial message
  showElement(noResultsElement);
});
