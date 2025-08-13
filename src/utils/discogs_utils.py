import requests
import random
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

DISCOGS_API_URL = 'https://api.discogs.com'
USER_AGENT = 'AlexaDiscogsSkill/1.0'

class DiscogsAPI:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
    
    def search_artists(self, artist_name: str, limit: int = 5) -> List[Dict]:
        """Search for artists by name"""
        try:
            response = self.session.get(f'{DISCOGS_API_URL}/database/search', params={
                'q': artist_name,
                'type': 'artist',
                'per_page': limit
            })
            response.raise_for_status()
            return response.json().get('results', [])
        except requests.RequestException as e:
            logger.error(f'Error searching artists: {e}')
            raise Exception('Could not search artists from Discogs')
    
    def get_artist_releases(self, artist_id: int, limit: int = 10) -> List[Dict]:
        """Get releases by artist ID"""
        try:
            response = self.session.get(f'{DISCOGS_API_URL}/artists/{artist_id}/releases', params={
                'per_page': limit,
                'sort': 'year',
                'sort_order': 'desc'
            })
            response.raise_for_status()
            return response.json().get('releases', [])
        except requests.RequestException as e:
            logger.error(f'Error fetching artist releases: {e}')
            raise Exception('Could not fetch releases from Discogs')
    
    def search_releases(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for releases"""
        try:
            response = self.session.get(f'{DISCOGS_API_URL}/database/search', params={
                'q': query,
                'type': 'release',
                'per_page': limit
            })
            response.raise_for_status()
            return response.json().get('results', [])
        except requests.RequestException as e:
            logger.error(f'Error searching releases: {e}')
            raise Exception('Could not search releases from Discogs')
    
    def get_random_release(self) -> Optional[Dict]:
        """Get a random release"""
        try:
            # Generate a random ID between 1 and 1000000
            random_id = random.randint(1, 1000000)
            response = self.session.get(f'{DISCOGS_API_URL}/releases/{random_id}')
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.info(f'Random release {random_id} not found')
                return None
        except requests.RequestException as e:
            logger.error(f'Error getting random release: {e}')
            return None

def format_release_for_speech(release: Dict) -> str:
    """Format release data for speech"""
    title = release.get('title', 'Unknown Title')
    year = release.get('year')
    if year:
        return f"{title} from {year}"
    return title

def format_artist_for_speech(artist: Dict) -> str:
    """Format artist data for speech"""
    return artist.get('title', 'Unknown Artist')

# Global instance
discogs_api = DiscogsAPI()