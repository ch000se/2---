class Api {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async fetchMoviesBySearchText(query, page = 1) {
        try {
            const response = await fetch(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

const api = new Api('e52fda134110945256469ed2ec1cb4fe');

let currentQuery = '';
let currentPage = 1;
let totalPages = 1;

function renderMovies(movies, resultsContainer, totalResults, append = false) {
    if (!append) {
        resultsContainer.innerHTML = '';
    }

    if (movies.length > 0) {
        if (!append) {
            const resultsHeader = document.createElement('h3');
            resultsHeader.textContent = `Results (${totalResults})`;
            resultsContainer.appendChild(resultsHeader);
        }

        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = movie.original_title;
            movieItem.appendChild(movieTitle);

            resultsContainer.appendChild(movieItem);
        });
    } else {
        resultsContainer.textContent = `No results for "${currentQuery}"`;
    }
}

async function handleSearch(query) {
    const data = await api.fetchMoviesBySearchText(query);
    currentQuery = query;
    currentPage = 1;
    totalPages = data.total_pages;

    const resultsContainer = document.getElementById('search-results');
    renderMovies(data.results, resultsContainer, data.total_results);

    if (currentPage < totalPages) {
        document.getElementById('load-more').style.display = 'block';
    } else {
        document.getElementById('load-more').style.display = 'none';
    }
}

async function loadMoreMovies() {
    currentPage += 1;
    const data = await api.fetchMoviesBySearchText(currentQuery, currentPage);

    const resultsContainer = document.getElementById('search-results');
    renderMovies(data.results, resultsContainer, data.total_results, true);

    if (currentPage >= totalPages) {
        document.getElementById('load-more').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const loadMoreButton = document.getElementById('load-more');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                await handleSearch(query);
            }
            searchInput.value = '';
        }
    });

    loadMoreButton.addEventListener('click', async () => {
        await loadMoreMovies();
    });
});
