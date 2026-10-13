import os
import time
import asyncio
from typing import Dict, Any, Optional, Union, List
import httpx
from dotenv import load_dotenv

load_dotenv()

class OpenDotaClient:
    def __init__(self, free_tier: Optional[bool] = None):
        self.api_key = os.getenv("OPENDOTA_API_KEY")
        self.base_url = "https://api.opendota.com/api"
        
        if free_tier is None:
            free_tier = os.getenv("OPENDOTA_FREE_TIER", "True").lower() == "true"
            
        # 1.05s d'intervalle minimum pour le plan Gratuit (respecte les 60 req/minute), 0.04s pour le plan Payant
        self.min_request_interval = 1.05 if free_tier else 0.04  
        self.last_request_time = 0.0
        self.client = httpx.AsyncClient()
        self.lock = asyncio.Lock()

    async def _wait_for_rate_limit(self):
        """Assure le respect du rate limit en espaçant les appels."""
        async with self.lock:
            now = time.time()
            elapsed = now - self.last_request_time
            if elapsed < self.min_request_interval:
                wait_time = self.min_request_interval - elapsed
                await asyncio.sleep(wait_time)
            self.last_request_time = time.time()

    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Union[Dict[str, Any], List[Any]]:
        """Effectue une requête GET sur l'API OpenDota avec mécanisme de retry."""
        await self._wait_for_rate_limit()
        
        if params is None:
            params = {}
        if self.api_key:
            params["api_key"] = self.api_key
            
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        max_retries = 3
        backoff = 2.0
        
        for attempt in range(max_retries):
            try:
                response = await self.client.get(url, params=params, timeout=15.0)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                status_code = e.response.status_code
                print(f"[Attempt {attempt + 1}/{max_retries}] HTTP error occurred: {status_code}")
                # Si c'est un code d'erreur serveur (5xx) ou rate limit (429), on réessaye après un délai
                if (status_code >= 500 or status_code == 429) and attempt < max_retries - 1:
                    sleep_time = backoff * (2 ** attempt)
                    print(f"Retrying in {sleep_time} seconds...")
                    await asyncio.sleep(sleep_time)
                else:
                    # Sinon (4xx client error, ou dernier essai), on propage l'erreur
                    raise
            except (httpx.RequestError, asyncio.TimeoutError) as e:
                print(f"[Attempt {attempt + 1}/{max_retries}] Network error occurred: {e}")
                if attempt < max_retries - 1:
                    sleep_time = backoff * (2 ** attempt)
                    print(f"Retrying in {sleep_time} seconds...")
                    await asyncio.sleep(sleep_time)
                else:
                    raise

    async def get_player_info(self, account_id: Union[int, str]) -> Dict[str, Any]:
        """Récupère les informations générales du profil d'un joueur."""
        return await self.get(f"players/{account_id}")

    async def get_player_recent_matches(self, account_id: Union[int, str]) -> List[Dict[str, Any]]:
        """Récupère les 20 derniers matchs d'un joueur."""
        return await self.get(f"players/{account_id}/recentMatches")

    async def get_player_matches(self, account_id: Union[int, str], limit: int = 100) -> List[Dict[str, Any]]:
        """Récupère l'historique des matchs d'un joueur avec une limite et des champs enrichis."""
        projects = [
            "gold_per_min", "xp_per_min", "hero_damage", "tower_damage", 
            "hero_healing", "lane", "lane_role", "is_roaming",
            "start_time", "leaver_status", "party_size"
        ]
        return await self.get(f"players/{account_id}/matches", params={"limit": limit, "project": projects})

    async def get_match_details(self, match_id: Union[int, str]) -> Dict[str, Any]:
        """Récupère les détails complets d'un match (statistiques détaillées de fin de partie)."""
        return await self.get(f"matches/{match_id}")

    async def get_heroes(self) -> List[Dict[str, Any]]:
        """Récupère la liste de tous les héros de Dota 2."""
        return await self.get("heroes")

    async def close(self):
        """Ferme la session du client HTTP."""
        await self.client.aclose()
