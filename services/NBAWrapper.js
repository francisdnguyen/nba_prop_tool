const axios = require('axios');

class NBAWrapper {
    constructor(baseURL = '') {
        this.baseURL = 'https://stats.nba.com/stats';
        this.backendURL = baseURL || 'http://localhost:3000';
        this.headers = {    
            'Accept-Language': 'en-US,en;q=0.9',
        };
    }

    // Get player ID by name
    async getPlayerId(playerName) {
        try {
            console.log("Beginning..");
            const response = await axios.get(`${this.backendURL}/api/getPlayerInfo`);
            const players = response.data.resultSets[0];

            // Dynamically find the index of 'DISPLAY_FIRST_LAST'
            const headers = players.headers;
            const playerNameIndex = headers.indexOf('DISPLAY_FIRST_LAST');
            if (playerNameIndex === -1) {
                throw new Error('DISPLAY_FIRST_LAST not found.')
            }

            // Find the player by name
            const player = players.rowSet.find(p => p[playerNameIndex].toLowerCase() === playerName.toLowerCase());
            if (!player) {
                throw new Error(`${playerName} not found.`);
            }

            // Dynamically find the index of the 'PERSON_ID'
            const playerIdIndex = headers.indexOf('PERSON_ID');
            if (playerIdIndex === -1) {
                throw new Error('PERSON_ID not found.');
            }

            return player[playerIdIndex];
        } catch (error) {
            console.error('Error fetching player ID:', error);
            throw error;
        }
    }

    // Get player team by ID 
    async getPlayerTeam(playerId) {
        try {
            const response = await axios.get(`${this.backendURL}/api/getPlayerTeam`, {
                params: {
                    PlayerID: playerId,
                },
            });
            const resultSet = response.data.resultSets[0];

            // Checks if player details exist
            if (!resultSet.rowSet.length) {
                throw new Error('Player details not found');
            }

            //  Dynamically find the index of 'TEAM_NAME'
            const headers = resultSet.headers;
            const teamNameIndex = headers.indexOf('TEAM_NAME');
            if (teamNameIndex === -1) {
                throw new Error('TEAM_NAME not found in response');
            }

            const teamName = resultSet.rowSet[0][teamNameIndex];
            console.log('Team name:', teamName);
            return teamName;
        } catch (error) {
            console.error('Error fetching player details:', error);
            throw error;
        }
    }

    // Get player game logs
    async getPlayerGameLogs({PlayerID, LastNGames, Season, SeasonType}) {
        try {
            const response = await axios.get(`${this.backendURL}/api/getPlayerGameLogs`, {
                params: {
                    PlayerID: PlayerID,
                    LastNGames: LastNGames,
                    Season: Season,
                    SeasonType: SeasonType,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching player game logs:', error);
            throw error;
        }
    }
   
    // Helper function to get the current NBA season
    getCurrentSeason = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are 0-indexed
  
        // NBA season typically starts in October
        if (month >= 10) {
            return `${year}-${(year + 1).toString().slice(-2)}`; // e.g., 2023-24
        } else {
            return `${year - 1}-${year.toString().slice(-2)}`; // e.g., 2022-23
        }
    };
}

export default NBAWrapper;