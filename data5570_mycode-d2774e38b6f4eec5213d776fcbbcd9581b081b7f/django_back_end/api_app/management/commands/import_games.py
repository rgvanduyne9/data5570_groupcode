from django.core.management.base import BaseCommand
import requests
from api_app.models import Game
from datetime import datetime
from django.db import transaction
import logging

class Command(BaseCommand):
    help = 'Fetch and update college football games for the current year'

    def handle(self, *args, **options):
        logger = logging.getLogger(__name__)
        start_time = datetime.now()
        current_year = datetime.now().year

        # API Configuration
        API_KEY = 'RhxfO4PC8d3xtTJasaGitD9rqj8njgWkUzDLe5eNfuLpNSURAI3RTb/YHFNnwvFG'
        BASE_URL = 'https://api.collegefootballdata.com'
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Accept': 'application/json'
        }

        try:
            with transaction.atomic():
                # Fetch games for current year
                games_url = f'{BASE_URL}/games'
                params = {
                    'year': current_year,
                    'seasonType': 'regular'
                }

                self.stdout.write(f'Fetching games for {current_year}...')
                
                response = requests.get(games_url, headers=headers, params=params)
                response.raise_for_status()
                games_data = response.json()

                # Get existing games for current year
                existing_games = {
                    (game.week, game.hometeam, game.awayteam): game 
                    for game in Game.objects.filter(dayofgame__year=current_year)
                }

                games_to_create = []
                games_to_update = []

                # Fetch team data first to get mascots
                self.stdout.write('Fetching team data...')
                teams_url = f'{BASE_URL}/teams'
                teams_response = requests.get(teams_url, headers=headers)
                teams_response.raise_for_status()
                teams_data = teams_response.json()

                # Create mascot lookup
                team_mascots = {team['school']: team.get('mascot', '') for team in teams_data}

                self.stdout.write('Processing games...')
                for game_data in games_data:
                    # Parse the ISO format date string
                    start_date = datetime.strptime(game_data['start_date'].split('T')[0], '%Y-%m-%d').date()
                    
                    # Handle the time portion
                    start_time_obj = datetime.strptime('00:00:00', '%H:%M:%S').time()
                    if game_data.get('start_time'):
                        try:
                            time_str = game_data['start_time'].split('T')[1].split('.')[0]
                            start_time_obj = datetime.strptime(time_str, '%H:%M:%S').time()
                        except (ValueError, IndexError):
                            pass

                    game_obj = {
                        'week': game_data['week'],
                        'seasontype': game_data['season_type'],
                        'dayofgame': start_date,
                        'timeofgame': start_time_obj,
                        'isstarttimetbd': game_data.get('start_time_tbd', True),
                        'hometeam': game_data['home_team'],
                        'homemascot': team_mascots.get(game_data['home_team'], ''),
                        'awayteam': game_data['away_team'],
                        'awaymascot': team_mascots.get(game_data['away_team'], '')
                    }

                    key = (game_obj['week'], game_obj['hometeam'], game_obj['awayteam'])

                    if key in existing_games:
                        # Update existing game
                        existing_game = existing_games[key]
                        for field, value in game_obj.items():
                            setattr(existing_game, field, value)
                        games_to_update.append(existing_game)
                    else:
                        # Create new game
                        games_to_create.append(Game(**game_obj))

                # Bulk create new games
                if games_to_create:
                    self.stdout.write(f'Creating {len(games_to_create)} new games...')
                    Game.objects.bulk_create(games_to_create, batch_size=1000)

                # Bulk update existing games
                if games_to_update:
                    self.stdout.write(f'Updating {len(games_to_update)} existing games...')
                    Game.objects.bulk_update(
                        games_to_update,
                        ['seasontype', 'dayofgame', 'timeofgame', 'isstarttimetbd',
                         'homemascot', 'awaymascot'],
                        batch_size=1000
                    )

                end_time = datetime.now()
                duration = end_time - start_time

                self.stdout.write(
                    self.style.SUCCESS(
                        f'\nUpdate Complete!\n'
                        f'Year: {current_year}\n'
                        f'Total games processed: {len(games_data)}\n'
                        f'New games created: {len(games_to_create)}\n'
                        f'Existing games updated: {len(games_to_update)}\n'
                        f'Time taken: {duration.total_seconds():.2f} seconds'
                    )
                )

        except requests.RequestException as e:
            logger.error(f'API Request Error: {str(e)}')
            self.stdout.write(self.style.ERROR(f'Error fetching data: {str(e)}'))
        except Exception as e:
            logger.error(f'Processing Error: {str(e)}')
            self.stdout.write(self.style.ERROR(f'Error processing data: {str(e)}'))
