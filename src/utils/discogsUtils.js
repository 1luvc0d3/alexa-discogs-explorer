const axios = require('axios');

const DISCOGS_BASE_URL = 'https://api.discogs.com';
const USER_AGENT = 'AlexaDiscogsExplorer/1.0';

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DiscogsAPI {
    constructor() {
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; // 1 second between requests
    }

    async makeRequest(url, params = {}) {
        // Simple rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            await delay(this.minRequestInterval - timeSinceLastRequest);
        }

        try {
            const response = await axios.get(url, {
                params,
                headers: {
                    'User-Agent': USER_AGENT
                },
                timeout: 5000
            });
            
            this.lastRequestTime = Date.now();
            return response.data;
        } catch (error) {
            console.error('Discogs API error:', error.message);
            throw new Error('Failed to fetch data from Discogs');
        }
    }

    async searchArtist(artistName) {
        const url = `${DISCOGS_BASE_URL}/database/search`;
        const params = {
            q: artistName,
            type: 'artist',
            per_page: 5
        };

        const data = await this.makeRequest(url, params);
        return data.results || [];
    }

    async getArtistReleases(artistId, limit = 10) {
        const url = `${DISCOGS_BASE_URL}/artists/${artistId}/releases`;
        const params = {
            per_page: limit,
            sort: 'year',
            sort_order: 'desc'
        };

        const data = await this.makeRequest(url, params);
        return data.releases || [];
    }

    async searchReleases(query) {
        const url = `${DISCOGS_BASE_URL}/database/search`;
        const params = {
            q: query,
            type: 'release',
            per_page: 10
        };

        const data = await this.makeRequest(url, params);
        return data.results || [];
    }

    async getRandomRelease() {
        // Generate a random release ID (Discogs has millions of releases)
        const randomId = Math.floor(Math.random() * 1000000) + 1;
        
        try {
            const url = `${DISCOGS_BASE_URL}/releases/${randomId}`;
            const data = await this.makeRequest(url);
            return data;
        } catch (error) {
            // If random ID doesn't exist, try a few more times
            for (let i = 0; i < 3; i++) {
                try {
                    const newRandomId = Math.floor(Math.random() * 1000000) + 1;
                    const url = `${DISCOGS_BASE_URL}/releases/${newRandomId}`;
                    const data = await this.makeRequest(url);
                    return data;
                } catch (retryError) {
                    continue;
                }
            }
            
            // Fallback: search for a random popular release
            const fallbackQueries = ['beatles', 'pink floyd', 'led zeppelin', 'bob dylan', 'rolling stones'];
            const randomQuery = fallbackQueries[Math.floor(Math.random() * fallbackQueries.length)];
            const releases = await this.searchReleases(randomQuery);
            
            if (releases.length > 0) {
                const randomRelease = releases[Math.floor(Math.random() * releases.length)];
                const url = `${DISCOGS_BASE_URL}/releases/${randomRelease.id}`;
                return await this.makeRequest(url);
            }
            
            throw new Error('Could not find a random release');
        }
    }

    formatReleaseForSpeech(release) {
        const title = release.title || 'Unknown Title';
        const artist = release.artists ? release.artists[0].name : 'Unknown Artist';
        const year = release.year || 'Unknown Year';
        
        return `${title} by ${artist} from ${year}`;
    }

    formatReleasesListForSpeech(releases, artistName) {
        if (!releases || releases.length === 0) {
            return `I couldn't find any releases by ${artistName}.`;
        }

        const maxReleases = Math.min(releases.length, 5);
        const releaseList = releases.slice(0, maxReleases).map(release => {
            const title = release.title || 'Unknown Title';
            const year = release.year || 'Unknown Year';
            return `${title} from ${year}`;
        }).join(', ');

        const moreText = releases.length > maxReleases ? ` and ${releases.length - maxReleases} more` : '';
        
        return `Here are some releases by ${artistName}: ${releaseList}${moreText}.`;
    }

    formatSearchResultsForSpeech(results, query) {
        if (!results || results.length === 0) {
            return `I couldn't find any releases matching "${query}".`;
        }

        const maxResults = Math.min(results.length, 3);
        const resultList = results.slice(0, maxResults).map(result => {
            const title = result.title || 'Unknown Title';
            const year = result.year || 'Unknown Year';
            return `${title} from ${year}`;
        }).join(', ');

        const moreText = results.length > maxResults ? ` and ${results.length - maxResults} more` : '';
        
        return `I found these releases matching "${query}": ${resultList}${moreText}.`;
    }
}

module.exports = new DiscogsAPI();