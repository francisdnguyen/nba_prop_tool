import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

// Cache for player list (shared across component instances)
let playerCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const PlayerInput = ({ playerName, setPlayerName }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { colors } = useTheme();
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch all players with caching
  const fetchAllPlayers = async () => {
    // Check if we have valid cached data
    const now = Date.now();
    if (playerCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      return playerCache;
    }

    try {
      const response = await fetch('/api/getPlayerInfo');
      
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }

      const data = await response.json();
      const players = data.resultSets[0];
      
      const headers = players.headers;
      const playerNameIndex = headers.indexOf('DISPLAY_FIRST_LAST');
      
      if (playerNameIndex === -1) {
        throw new Error('Player name field not found in response');
      }

      const playerNames = players.rowSet
        .map(player => player[playerNameIndex])
        .sort((a, b) => a.localeCompare(b));

      // Cache the results
      playerCache = playerNames;
      cacheTimestamp = now;
      
      return playerNames;
    } catch (error) {
      console.error('Error fetching all players:', error);
      
      // Return popular players as fallback
      const fallbackPlayers = [
        'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
        'Luka Doncic', 'Jayson Tatum', 'Joel Embiid', 'Nikola Jokic',
        'Damian Lillard', 'Jimmy Butler', 'Kawhi Leonard', 'Paul George',
        'Anthony Davis', 'Devin Booker', 'Donovan Mitchell', 'Trae Young',
        'Ja Morant', 'Zion Williamson', 'Anthony Edwards', 'Tyrese Haliburton',
        'Russell Westbrook', 'Chris Paul', 'Klay Thompson', 'Draymond Green',
        'Bam Adebayo', 'Tyler Herro', 'Scottie Barnes', 'Paolo Banchero',
        'Victor Wembanyama', 'Chet Holmgren', 'Alperen Sengun', 'Franz Wagner',
        'Evan Mobley', 'Cade Cunningham', 'Jalen Green', 'Josh Giddey',
        'Scottie Pippen Jr.', 'Brandon Miller', 'Ausar Thompson', 'Amen Thompson'
      ].sort();
      
      playerCache = fallbackPlayers;
      cacheTimestamp = now;
      
      return fallbackPlayers;
    }
  };

  // Load players on component mount
  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const players = await fetchAllPlayers();
        setAllPlayers(players);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // Filter suggestions based on input with fuzzy matching
  useEffect(() => {
    if (playerName.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = playerName.toLowerCase();
    
    // Priority scoring: exact starts with > contains > fuzzy match
    const scoredResults = allPlayers.map(player => {
      const playerLower = player.toLowerCase();
      const names = playerLower.split(' ');
      
      let score = 0;
      
      // Highest priority: exact match or starts with search term
      if (playerLower.startsWith(searchTerm)) {
        score = 1000;
      }
      // High priority: any name part starts with search term
      else if (names.some(name => name.startsWith(searchTerm))) {
        score = 800;
      }
      // Medium priority: contains search term
      else if (playerLower.includes(searchTerm)) {
        score = 600;
      }
      // Lower priority: fuzzy match (initials, partial matches)
      else {
        // Check if search term matches initials
        const initials = names.map(name => name[0]).join('');
        if (initials.includes(searchTerm)) {
          score = 400;
        }
        // Check for partial word matches
        else if (names.some(name => searchTerm.split('').every(char => name.includes(char)))) {
          score = 200;
        }
      }
      
      return { player, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(result => result.player);

    setSuggestions(scoredResults);
    setShowSuggestions(scoredResults.length > 0);
    setHighlightedIndex(-1);
  }, [playerName, allPlayers]);

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setPlayerName(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        // Auto-complete with first suggestion on tab
        if (suggestions.length > 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[0]);
        }
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Highlight matching text in suggestions
  const highlightText = (text, search) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-blue-500/30 text-blue-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="mb-6 relative">
      <label className={`block text-xl mb-3 font-semibold ${colors.textSecondary}`} htmlFor="player-name">
        Enter Player Name
        {loading && (
          <span className="ml-2 text-xs text-blue-400 animate-pulse">
            Loading {playerCache ? 'updated ' : ''}players...
          </span>
        )}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="player-name"
          value={playerName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full py-4 px-4 pr-12 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          placeholder="Start typing a player name..."
          autoComplete="off"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Search Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-500/20 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  index === highlightedIndex ? 'bg-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {suggestion.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {highlightText(suggestion, playerName)}
                  </span>
                </div>
              </button>
            ))}
            
            {suggestions.length === 0 && playerName.trim().length >= 2 && !loading && (
              <div className="px-4 py-3 text-gray-400 text-center">
                <svg className="w-6 h-6 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                No players found matching "{playerName}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      {showSuggestions && (
        <div className="mt-2 text-xs text-gray-400 flex items-center space-x-4">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>⇥ Auto-complete</span>
          <span>⎋ Close</span>
        </div>
      )}
    </div>
  );
};

export default PlayerInput;