import sys
from nba_api.stats.static import players

# Get the player name from the command line arguments
player_name = sys.argv[1]

# Find the player by name
matching_players = players.find_players_by_full_name(player_name)

if matching_players:
    player_id = matching_players[0]['id']  # Get the ID of the first matching player
    print(player_id)  # Send the player ID to stdout
else:
    sys.stderr.write(f"No player found with the name {player_name}.")
    sys.exit(1)