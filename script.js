const accessKey = "DFHs_glgSAUwUgy1iPKxFQK1YLySIUTXIavr06yVju8";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMore = document.getElementById("show-more");

let keyword = "";
let page = 1;

async function searchImage() {
  keyword = searchBox.value;

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      searchResult.innerHTML = "";
    }

    const results = data.results;

    results.forEach((result) => {
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Unsplash Image";

      const imageLink = document.createElement("a");
      imageLink.href = result.urls.full; // Use full-size image for downloads
      imageLink.download = `unsplash-${result.id}.jpg`; // Set download filename

      imageLink.appendChild(image);

      searchResult.appendChild(imageLink);
    });

    if (results.length > 0) {
      showMore.style.display = "block";
    } else {
      showMore.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImage();
});

showMore.addEventListener("click", () => {
  page++;
  searchImage();
});
