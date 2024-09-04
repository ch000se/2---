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

function renderMovies(movies, resultsContainer, totalResults) {
    resultsContainer.innerHTML = '';

    if (movies.length > 0) {
        const resultsHeader = document.createElement('h3');
        resultsHeader.textContent = `Results (${totalResults})`;
        resultsContainer.appendChild(resultsHeader);

        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = movie.original_title;
            movieItem.appendChild(movieTitle);

            resultsContainer.appendChild(movieItem);
        });
    } else {
        resultsContainer.textContent = `No results for "${query}"`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const data = await api.fetchMoviesBySearchText(query);
                renderMovies(data.results, resultsContainer, data.total_results);
            }
            searchInput.value = ''; // Очищаємо інпут
        }
    });
});
