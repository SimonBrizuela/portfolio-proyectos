// Movie Search App - JavaScript
// Reemplaza 'YOUR_API_KEY' con tu clave de OMDb API

const API_KEY = 'e81eec22';
const API_BASE = 'https://www.omdbapi.com/';

class MovieSearchApp {
    constructor() {
        this.movies = [];
        this.favorites = this.loadFavorites();
        this.watchlist = this.loadWatchlist();
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.currentSearch = '';
        this.totalResults = 0;
        this.init();
    }

    init() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.moviesGrid = document.getElementById('moviesGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.filterTags = document.querySelectorAll('.filter-tag');
        this.movieModal = document.getElementById('movieModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeModal = document.querySelector('.close-modal');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loadMoreContainer = document.getElementById('loadMoreContainer');

        this.addEventListeners();
        this.renderMovies();
    }

    addEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        this.filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.filterTags.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderMovies();
            });
        });

        this.closeModal.addEventListener('click', () => this.hideModal());
        this.movieModal.addEventListener('click', (e) => {
            if (e.target === this.movieModal) this.hideModal();
        });

        this.loadMoreBtn.addEventListener('click', () => this.loadMore());
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.currentSearch = query;
        this.currentPage = 1;
        this.movies = [];
        await this.searchMovies(query, this.currentPage);
    }

    async searchMovies(query, page = 1) {
        this.showLoading();
        this.hideError();
        this.loadMoreContainer.classList.add('hidden');

        try {
            const response = await fetch(
                `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
            );

            const data = await response.json();

            if (data.Response === 'False') {
                throw new Error(data.Error || 'No se encontraron películas');
            }

            this.totalResults = parseInt(data.totalResults);
            
            // Obtener detalles completos de cada película
            const detailedMovies = await Promise.all(
                data.Search.map(movie => this.getMovieDetails(movie.imdbID))
            );

            if (page === 1) {
                this.movies = detailedMovies;
            } else {
                this.movies = [...this.movies, ...detailedMovies];
            }

            this.renderMovies();

            // Mostrar botón "Cargar más" si hay más resultados
            if (this.movies.length < this.totalResults) {
                this.loadMoreContainer.classList.remove('hidden');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async getMovieDetails(imdbID) {
        try {
            const response = await fetch(
                `${API_BASE}?apikey=${API_KEY}&i=${imdbID}&plot=full`
            );
            return await response.json();
        } catch (error) {
            console.error('Error getting movie details:', error);
            return null;
        }
    }

    async loadMore() {
        this.currentPage++;
        await this.searchMovies(this.currentSearch, this.currentPage);
    }

    getFilteredMovies() {
        switch (this.currentFilter) {
            case 'favorites':
                return this.movies.filter(m => this.favorites.includes(m.imdbID));
            case 'watchlist':
                return this.movies.filter(m => this.watchlist.includes(m.imdbID));
            default:
                return this.movies;
        }
    }

    renderMovies() {
        const filtered = this.getFilteredMovies();
        this.moviesGrid.innerHTML = '';

        if (filtered.length === 0) {
            this.moviesGrid.innerHTML = `
                <div class="empty-state">
                    <p>${this.currentFilter === 'all' ? 'Search for movies to get started' : 'No movies in this section'}</p>
                </div>
            `;
            return;
        }

        filtered.forEach(movie => {
            const card = this.createMovieCard(movie);
            this.moviesGrid.appendChild(card);
        });
    }

    createMovieCard(movie) {
        const div = document.createElement('div');
        div.className = 'movie-card';

        const isFavorite = this.favorites.includes(movie.imdbID);
        const isWatchlist = this.watchlist.includes(movie.imdbID);

        div.innerHTML = `
            <div class="movie-actions">
                <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" title="Favorito">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
                <button class="action-btn watchlist-btn ${isWatchlist ? 'active' : ''}" title="Ver después">
                    ${isWatchlist ? '📌' : '📍'}
                </button>
            </div>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                 alt="${movie.Title}" 
                 class="movie-poster" />
            <div class="movie-info">
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-meta">
                    <span>${movie.Year}</span>
                    <span class="movie-rating">⭐ ${movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'}</span>
                </div>
            </div>
        `;

        // Click en la tarjeta para ver detalles
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('action-btn')) {
                this.showMovieDetails(movie);
            }
        });

        // Botón de favoritos
        const favoriteBtn = div.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(movie.imdbID);
        });

        // Botón de watchlist
        const watchlistBtn = div.querySelector('.watchlist-btn');
        watchlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWatchlist(movie.imdbID);
        });

        return div;
    }

    showMovieDetails(movie) {
        this.modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                     alt="${movie.Title}" 
                     class="modal-poster" />
                <div class="modal-info">
                    <h2 class="modal-title">${movie.Title}</h2>
                    <div class="modal-meta">
                        <span>📅 ${movie.Year}</span>
                        <span>⏱️ ${movie.Runtime}</span>
                        <span>🎭 ${movie.Rated}</span>
                    </div>
                    <div class="modal-rating">
                        <span class="rating-value">⭐ ${movie.imdbRating}/10</span>
                        <span style="color: #999;">(${movie.imdbVotes} votos)</span>
                    </div>
                    <p class="modal-plot">${movie.Plot}</p>
                </div>
            </div>
            <div class="modal-details">
                <div class="detail-group">
                    <div class="detail-label">Director</div>
                    <div class="detail-value">${movie.Director}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Reparto</div>
                    <div class="detail-value">${movie.Actors}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Género</div>
                    <div class="detail-value">${movie.Genre}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Escritor</div>
                    <div class="detail-value">${movie.Writer}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Idioma</div>
                    <div class="detail-value">${movie.Language}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">País</div>
                    <div class="detail-value">${movie.Country}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Premios</div>
                    <div class="detail-value">${movie.Awards}</div>
                </div>
                <div class="detail-group">
                    <div class="detail-label">Recaudación</div>
                    <div class="detail-value">${movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'No disponible'}</div>
                </div>
            </div>
        `;

        this.movieModal.classList.remove('hidden');
    }

    hideModal() {
        this.movieModal.classList.add('hidden');
    }

    toggleFavorite(imdbID) {
        if (this.favorites.includes(imdbID)) {
            this.favorites = this.favorites.filter(id => id !== imdbID);
        } else {
            this.favorites.push(imdbID);
        }
        this.saveFavorites();
        this.renderMovies();
    }

    toggleWatchlist(imdbID) {
        if (this.watchlist.includes(imdbID)) {
            this.watchlist = this.watchlist.filter(id => id !== imdbID);
        } else {
            this.watchlist.push(imdbID);
        }
        this.saveWatchlist();
        this.renderMovies();
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = `Error: ${message}`;
        this.errorMessage.classList.remove('hidden');
        this.moviesGrid.innerHTML = '';
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    saveFavorites() {
        localStorage.setItem('movieFavorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('movieFavorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveWatchlist() {
        localStorage.setItem('movieWatchlist', JSON.stringify(this.watchlist));
    }

    loadWatchlist() {
        const saved = localStorage.getItem('movieWatchlist');
        return saved ? JSON.parse(saved) : [];
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new MovieSearchApp();
});
