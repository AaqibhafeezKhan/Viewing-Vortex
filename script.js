const TMDB_API_KEY = 'e1397be1c562b21fb75ae207765852dc';

class MediaPicker {
    constructor(type, updateCallback) {
        this.type = type;
        this.currentItem = null;
        this.filters = {
            genre: null,
            year: null,
            language: 'en-US'
        };
        this.updateCallback = updateCallback;
    }

    async fetchRandom() {
        try {
            let data;
            switch(this.type) {
                case 'movie':
                    data = await this.fetchFromTMDB('movie');
                    break;
                case 'tv':
                    data = await this.fetchFromTMDB('tv');
                    break;
                case 'book':
                    data = await this.fetchRandomBook();
                    break;
            }
            this.currentItem = data;
            await this.displayMedia(data);
        } catch (error) {
            this.showError(error);
        }
    }

    async fetchFromTMDB(contentType) {
        try {
            // First get random item from discovery
            const discoverUrl = new URL(`https://api.themoviedb.org/3/discover/${contentType}`);
            const params = {
                api_key: TMDB_API_KEY,
                language: this.filters.language,
                sort_by: 'popularity.desc',
                page: Math.floor(Math.random() * 100) + 1,
                include_adult: false
            };

            if (this.filters.genre) params.with_genres = this.filters.genre;
            if (this.filters.year) params.primary_release_year = this.filters.year;

            discoverUrl.search = new URLSearchParams(params).toString();
            const discoverResponse = await fetch(discoverUrl);
            
            if (!discoverResponse.ok) throw new Error(`HTTP error! status: ${discoverResponse.status}`);
            
            const discoverData = await discoverResponse.json();
            
            if (!discoverData.results?.length) {
                throw new Error('No results found');
            }

            const randomItem = discoverData.results[Math.floor(Math.random() * discoverData.results.length)];
            
            // Get full details
            const detailsUrl = `https://api.themoviedb.org/3/${contentType}/${randomItem.id}?api_key=${TMDB_API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);
            
            if (!detailsResponse.ok) throw new Error(`HTTP error! status: ${detailsResponse.status}`);
            
            return await detailsResponse.json();

        } catch (error) {
            this.showError(error);
            throw error;
        }
    }

    async fetchRandomBook() {
        try {
            const response = await fetch(
                `https://openlibrary.org/search.json?q=${Math.random().toString(36).substring(7)}`
            );
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (!data.docs?.length) {
                throw new Error('No books found');
            }

            const book = data.docs[Math.floor(Math.random() * data.docs.length)];
            return {
                title: book.title,
                author: book.author_name?.[0] || 'Unknown',
                year: book.first_publish_year || 'Unknown',
                description: book.first_sentence?.[0] || 'No description available',
                cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
            };
            
        } catch (error) {
            this.showError(error);
            throw error;
        }
    }

    async displayMedia(data) {
        const section = document.getElementById(this.type);
        const trailerButton = await this.getTrailerButton(data);

        section.innerHTML = `
            <div class="picker-card">
                <div class="media-poster">
                    ${this.getImageHTML(data)}
                </div>
                <div class="media-details">
                    <h2>${data.title || data.name || 'Untitled'}</h2>
                    <div class="meta-info">
                        ${this.getMetaData(data)}
                    </div>
                    <p class="description">${this.getDescription(data)}</p>
                    <div class="action-buttons">
                        <button class="pick-another">Pick Another</button>
                        <button class="save-favorite">Save to Favorites</button>
                        ${trailerButton}
                    </div>
                </div>
            </div>
        `;

        section.querySelector('.pick-another').addEventListener('click', () => this.fetchRandom());
        section.querySelector('.save-favorite').addEventListener('click', () => this.saveToFavorites());
    }

    getImageHTML(data) {
        if (this.type === 'book') {
            return data.cover 
                ? `<img src="${data.cover}" alt="${data.title}">`
                : '<div class="no-cover">No cover available</div>';
        }
        return data.poster_path 
            ? `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title || data.name}">`
            : '<div class="no-poster">No image available</div>';
    }

    getMetaData(data) {
        if (this.type === 'movie' || this.type === 'tv') {
            return `
                <div class="meta-item">
                    <i class="fas fa-star"></i>
                    ${(data.vote_average?.toFixed(1) || 'N/A')}
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    ${(this.type === 'movie' 
                        ? data.release_date?.substring(0,4) 
                        : data.first_air_date?.substring(0,4)) || 'N/A'}
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${this.type === 'movie' 
                        ? this.formatRuntime(data.runtime)
                        : this.formatSeasons(data.number_of_seasons)}
                </div>
            `;
        }
        return `
            <div class="meta-item">
                <i class="fas fa-user"></i>
                ${data.author || 'Unknown'}
            </div>
            <div class="meta-item">
                <i class="fas fa-calendar"></i>
                ${data.year || 'Unknown'}
            </div>
        `;
    }

    formatRuntime(minutes) {
        if (!minutes || minutes < 1) return 'N/A mins';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 
            ? `${hours}h ${mins.toString().padStart(2, '0')}m` 
            : `${minutes}m`;
    }

    formatSeasons(seasons) {
        if (!seasons || seasons < 1) return 'N/A seasons';
        return `${seasons} ${seasons === 1 ? 'season' : 'seasons'}`;
    }

    getDescription(data) {
        if (this.type === 'book') return data.description;
        return data.overview || 'No description available';
    }

    async getTrailerButton(data) {
        if (this.type === 'book') return '';
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/${this.type}/${data.id}/videos?api_key=${TMDB_API_KEY}`
            );
            const videos = await response.json();
            const trailer = videos.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
            return trailer 
                ? `<button class="watch-trailer" onclick="window.open('https://youtube.com/watch?v=${trailer.key}', '_blank')">
                    <i class="fab fa-youtube"></i> Watch Trailer
                   </button>`
                : '';
        } catch (error) {
            return '';
        }
    }

    saveToFavorites() {
        if (!this.currentItem) return;
        
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const favoriteItem = {
            type: this.type,
            data: this.currentItem,
            dateAdded: new Date().toISOString()
        };
        
        // Check for existing entry using ID or title/type combination
        const exists = favorites.some(fav => 
            (fav.data.id && fav.data.id === favoriteItem.data.id) ||
            (fav.data.title === favoriteItem.data.title && fav.type === favoriteItem.type)
        );
        
        if (!exists) {
            favorites.push(favoriteItem);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (this.updateCallback) this.updateCallback();
        }
    }

    showError(error) {
        const section = document.getElementById(this.type);
        section.innerHTML = `
            <div class="error">
                <h2>Error loading content</h2>
                <p>${error.message}</p>
                <button class="retry-button">Try Again</button>
            </div>
        `;
        section.querySelector('.retry-button').addEventListener('click', () => this.fetchRandom());
    }
}

class AppController {
    constructor() {
        this.moviePicker = new MediaPicker('movie', () => this.updateFavoritesList());
        this.tvPicker = new MediaPicker('tv', () => this.updateFavoritesList());
        this.bookPicker = new MediaPicker('book', () => this.updateFavoritesList());
        
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateFavoritesList();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchSection(btn.dataset.section));
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Favorites sidebar
        document.getElementById('favorites-toggle').addEventListener('click', () => 
            document.getElementById('favorites-sidebar').classList.add('active'));
        
        document.getElementById('close-favorites').addEventListener('click', () => 
            document.getElementById('favorites-sidebar').classList.remove('active'));

        // Initial load
        this.moviePicker.fetchRandom();
    }

    switchSection(sectionId) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.picker-section').forEach(section => section.classList.remove('active'));
        
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        document.getElementById(sectionId).classList.add('active');
        
        if (!document.getElementById(sectionId).innerHTML) {
            this[`${sectionId}Picker`].fetchRandom();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.getElementById('theme-toggle').innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').innerHTML = savedTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    updateFavoritesList() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const list = document.getElementById('favorites-list');
        list.innerHTML = favorites.map(fav => `
            <div class="favorite-item">
                ${this.getFavoriteImage(fav)}
                <div>
                    <h3>${fav.data.title || fav.data.name || 'Untitled'}</h3>
                    <small>${fav.type.toUpperCase()} · ${new Date(fav.dateAdded).toLocaleDateString()}</small>
                    <button class="remove-favorite" data-id="${fav.dateAdded}">&times;</button>
                </div>
            </div>
        `).join('');

        // Add remove functionality
        list.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                const newFavorites = favorites.filter(f => f.dateAdded !== btn.dataset.id);
                localStorage.setItem('favorites', JSON.stringify(newFavorites));
                this.updateFavoritesList();
            });
        });
    }

    getFavoriteImage(fav) {
        if (fav.data.poster_path) {
            return `<img src="https://image.tmdb.org/t/p/w200${fav.data.poster_path}" alt="${fav.data.title}">`;
        }
        if (fav.data.cover) {
            return `<img src="${fav.data.cover}" alt="${fav.data.title}">`;
        }
        return '<div class="no-fav-image">No Image</div>';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => new AppController());