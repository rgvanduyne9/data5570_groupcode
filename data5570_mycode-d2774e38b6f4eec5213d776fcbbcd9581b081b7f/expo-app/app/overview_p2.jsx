import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Card, ProgressBar, Menu, Divider, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSportsData } from '../state/sportsSlice';
import { LinearGradient } from 'expo-linear-gradient';

// Team information mapping
const teamInfo = {
  'Utah State': { logo: require('../assets/logos/USU.png'), name: 'Utah State' },
  'UTEP Miners': { logo: require('../assets/logos/UTEP.png'), name: 'UTEP' },
  'UTEP': { logo: require('../assets/logos/UTEP.png'), name: 'UTEP' },
  'Texas A&M Aggies': { logo: require('../assets/logos/TAMU.png'), name: 'Texas A&M' },
  'Air Force Falcons': { logo: require('../assets/logos/AFA.png'), name: 'Air Force' },
  'McNeese State Cowboys': { logo: require('../assets/logos/MCN.png'), name: 'McNeese State' },
  'Vanderbilt Commodores': { logo: require('../assets/logos/VAN.png'), name: 'Vanderbilt' },
  'Hawai\'i Rainbow Warriors': { logo: require('../assets/logos/HAW.png'), name: 'Hawai\'i' },
  'Hawai\'i': { logo: require('../assets/logos/HAW.png'), name: 'Hawai\'i' },
  'Hawaii': { logo: require('../assets/logos/HAW.png'), name: 'Hawai\'i' },
  'San Jose State': { logo: require('../assets/logos/SJSU.png'), name: 'San Jose State' },
  'San José State': { logo: require('../assets/logos/SJSU.png'), name: 'San José State' },
  'San Jose State Spartans': { logo: require('../assets/logos/SJSU.png'), name: 'San Jose State' },
  'SJSU': { logo: require('../assets/logos/SJSU.png'), name: 'San Jose State' },
  'New Mexico Lobos': { logo: require('../assets/logos/UNM.png'), name: 'New Mexico' },
  'Nevada Wolf Pack': { logo: require('../assets/logos/NEV.png'), name: 'Nevada' },
  'UNLV Rebels': { logo: require('../assets/logos/UNLV.png'), name: 'UNLV' },
  'Fresno State Bulldogs': { logo: require('../assets/logos/FRES.png'), name: 'Fresno State' },
  'Boise State Broncos': { logo: require('../assets/logos/BSU.png'), name: 'Boise State' },
  'UT Martin': { logo: require('../assets/logos/UTM.png'), name: 'UT Martin' },
  'UL Monroe': { logo: require('../assets/logos/ULM.png'), name: 'UL Monroe' },
  'Liberty': { logo: require('../assets/logos/LU.png'), name: 'Liberty' },
  'Sam Houston': { logo: require('../assets/logos/SH.png'), name: 'Sam Houston' },
  'Kennesaw State': { logo: require('../assets/logos/KS.png'), name: 'Kennesaw State' },
  'Jacksonville State': { logo: require('../assets/logos/JSU.png'), name: 'Jacksonville State' },
  'Missouri State': { logo: require('../assets/logos/MSU.png'), name: 'Missouri State' },
  'New Mexico State': { logo: require('../assets/logos/NMSU.png'), name: 'New Mexico State' },
  'Delaware': { logo: require('../assets/logos/D.png'), name: 'Delaware' },
  'Louisiana Tech': { logo: require('../assets/logos/LT.png'), name: 'Louisiana Tech' },
  'Louisiana Tech Bulldogs': { logo: require('../assets/logos/LT.png'), name: 'Louisiana Tech' },
};

// Default logo
const defaultLogo = require('../assets/logos/DefaultLogo.png');

// Get team info with fallback to default
const getTeamInfo = (teamName) => {
  console.log('Looking up team:', teamName);
  console.log('Available team keys:', Object.keys(teamInfo));
  
  // Try exact match first
  let info = teamInfo[teamName];
  
  // If no exact match, try partial match with more specific rules
  if (!info) {
    const partialMatch = Object.keys(teamInfo).find(key => {
      // Normalize both strings for comparison
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedTeam = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check if either string contains the other
      const keyContainsTeam = normalizedKey.includes(normalizedTeam);
      const teamContainsKey = normalizedTeam.includes(normalizedKey);
      
      // For Georgia Southern specifically, ensure we match the full name
      if (teamName.toLowerCase().includes('georgia southern')) {
        return key.toLowerCase().includes('georgia southern');
      }
      
      // For other teams, use the existing logic
      return keyContainsTeam || teamContainsKey;
    });
    
    if (partialMatch) {
      console.log(`Found partial match for ${teamName}: ${partialMatch}`);
      info = teamInfo[partialMatch];
    }
  }
  
  if (!info) {
    console.log(`No match found for ${teamName}, using default logo`);
    return {
      logo: defaultLogo,
      name: teamName
    };
  }
  
  console.log(`Found match for ${teamName}:`, info);
  return info;
};

export default function OverviewP2() {
  console.log('Rendering OverviewP2');
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedSchool, setSelectedSchool] = useState('utahState');
  const [selectedWeek, setSelectedWeek] = useState('week1');
  const [visible, setVisible] = useState(false);
  const [weekVisible, setWeekVisible] = useState(false);
  const [error, setError] = useState(null);
  
  try {
    console.log('Getting data from Redux store');
    const sportsData = useSelector((state) => {
      console.log('Sports data from store:', state.sports);
      return state.sports.sportsData;
    });
    const sportsStatus = useSelector((state) => state.sports.status);
    const checkboxes = useSelector((state) => state.checkboxes);
    const checkedItems = useSelector((state) => state.checkboxes[selectedSchool] || {
      offense: Array(17).fill(false),
      defense: Array(17).fill(false),
      kicks: Array(17).fill(false),
      resolvedOffense: Array(17).fill(false),
      resolvedDefense: Array(17).fill(false),
      resolvedKicks: Array(17).fill(false),
      tvOffense: Array(17).fill(false),
      tvDefense: Array(17).fill(false),
      tvKicks: Array(17).fill(false),
    });
    const gameNotes = useSelector((state) => state.gameNotes);
    const [expandedNotes, setExpandedNotes] = useState({});
    const theme = useTheme();
    console.log('Theme:', theme);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      contentContainer: {
        padding: 20,
        paddingBottom: 40,
        flex: 1,
        justifyContent: 'space-between',
      },
      progressSection: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: 10,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      progressLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
      },
      progressPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
      },
      progressBarContainer: {
        height: 30,
      },
      progressBarBackground: {
        height: '100%',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      progressBarFill: {
        height: '100%',
        borderRadius: 15,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
      },
      gradient: {
        flex: 1,
        width: '100%',
      },
      card: {
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20,
        backgroundColor: theme.colors.surface,
      },
      cardContent: {
        paddingHorizontal: 16,
      },
      dropdownsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
      },
      dropdownContainer: {
        width: '48%',
      },
      dropdownButton: {
        marginBottom: 0,
        width: '100%',
      },
      dropdownButtonContent: {
        justifyContent: 'flex-start',
      },
      submitButton: {
        marginTop: 0,
        backgroundColor: '#4169E1', // Royal blue color
        width: '48%',
        alignSelf: 'flex-start',
      },
      spacer: {
        flex: 1,
      },
      upcomingGamesCard: {
        borderRadius: 10,
        elevation: 2,
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: theme.colors.surface,
      },
      upcomingGamesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
      },
      gamesScrollView: {
        flex: 1,
        marginHorizontal: -16,
      },
      gamesList: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
      },
      gameCard: {
        width: 300,
        backgroundColor: theme.colors.surface,
        padding: 15,
        borderRadius: 8,
        marginRight: 15,
        elevation: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      gameTeamsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      teamContainer: {
        alignItems: 'center',
        flex: 1,
        padding: 5,
      },
      teamLogo: {
        width: 60,
        height: 60,
        marginBottom: 8,
      },
      teamName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 5,
        width: '100%',
      },
      vsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.placeholder,
        marginHorizontal: 10,
      },
      gameInfoContainer: {
        alignItems: 'center',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 10,
      },
      gameDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 5,
      },
      gameTime: {
        fontSize: 12,
        color: theme.colors.placeholder,
      },
      loadingText: {
        textAlign: 'center',
        color: theme.colors.text,
        padding: 10,
      },
      noGamesText: {
        textAlign: 'center',
        color: theme.colors.text,
        padding: 10,
      },
      scheduleCard: {
        borderRadius: 10,
        elevation: 2,
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: theme.colors.surface,
      },
      scheduleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
      },
      scheduleContent: {
        backgroundColor: theme.colors.surface,
      },
      scheduleTable: {
        width: '100%',
      },
      tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.border,
        marginBottom: 10,
      },
      headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
        textAlign: 'center',
      },
      tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      opponentColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      detailsColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      dateColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      timeColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      downloadedColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      resolvedColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      tvColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
      },
      notesColumn: {
        flex: 1.5,
        paddingHorizontal: 5,
        minHeight: 40,
      },
      notesText: {
        fontSize: 14,
        color: theme.colors.text,
        textAlign: 'right',
      },
      gameType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
      },
      gameDetails: {
        fontSize: 12,
        color: '#666',
      },
      dropdownLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 5,
        backgroundColor: theme.colors.surface,
        padding: 5,
        borderRadius: 5,
      },
      completeText: {
        color: theme.colors.success,
      },
      incompleteText: {
        color: theme.colors.error,
      },
      noGameText: {
        color: theme.colors.placeholder,
      },
      scheduleText: {
        fontSize: 14,
        color: theme.colors.text,
        textAlign: 'left',
      },
      expandableNoteContainer: {
        width: '100%',
      },
      noteContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 5,
      },
      arrowContainer: {
        marginLeft: 5,
        justifyContent: 'center',
      },
      arrowText: {
        color: theme.colors.text,
        fontSize: 12,
      },
    });

    const schoolOptions = [
      { label: 'Utah State', value: 'utahState' },
      { label: 'UTEP', value: 'utep' },
      { label: 'Texas A&M', value: 'texasAM' },
      { label: 'Air Force', value: 'airForce' },
      { label: 'McNeese State', value: 'mcneeseState' },
      { label: 'Vanderbilt', value: 'vanderbilt' },
      { label: 'Hawai\'i', value: 'hawaii' },
      { label: 'San Jose State', value: 'sanJoseState' },
      { label: 'New Mexico', value: 'newMexico' },
      { label: 'Nevada', value: 'nevada' },
      { label: 'UNLV', value: 'unlv' },
      { label: 'Fresno State', value: 'fresnoState' },
      { label: 'Boise State', value: 'boiseState' },
    ];

    const weekOptions = [
      { label: 'Week 0', value: 'week0' },
      ...Array.from({ length: 17 }, (_, i) => ({
        label: `Week ${i + 1}`,
        value: `week${i + 1}`,
      }))
    ];

    // Function to fetch games data
    const fetchGames = () => {
      console.log('Fetching updated games data...');
      // Fetch all games for the overview page
      dispatch(fetchSportsData('all'));
    };

    // Initial fetch when component mounts
    useEffect(() => {
      fetchGames();
    }, [dispatch]);

    // Set up daily refresh
    useEffect(() => {
      // Calculate time until next midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      // Set initial timeout for next midnight
      const timeoutId = setTimeout(() => {
        fetchGames();
        // Set up interval for daily refreshes after first midnight
        const intervalId = setInterval(fetchGames, 24 * 60 * 60 * 1000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, msUntilMidnight);

      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
    }, [dispatch]);

    const handleSchoolSelect = (school) => {
      setSelectedSchool(school);
      setVisible(false);
    };

    const handleWeekSelect = (week) => {
      setSelectedWeek(week);
      setWeekVisible(false);
    };

    const handleSubmit = () => {
      if (selectedSchool) {
        router.push({
          pathname: '/TeamPage',
          params: { school: selectedSchool }
        });
      }
    };

    // Calculate progress based on checked boxes
    const calculateProgress = () => {
      if (!selectedSchool) return 0;
      
      const totalBoxes = 17 * 9; // 17 games, 9 categories
      let checkedCount = 0;
      
      // Count checked boxes in each category
      Object.values(checkedItems).forEach(category => {
        checkedCount += category.filter(checked => checked).length;
      });
      
      return checkedCount / totalBoxes;
    };

    const progress = calculateProgress();

    // Get all upcoming games
    const getUpcomingGames = () => {
      if (!sportsData || sportsData.length === 0) {
        console.log('No sports data available:', sportsData);
        return [];
      }
      
      const now = new Date();
      
      // Get games for Utah State by default, or selected school if one is chosen
      const teamToShow = selectedSchool ? 
        schoolOptions.find(school => school.value === selectedSchool)?.label : 
        'Utah State';
      
      // Handle team name variations
      const teamVariations = teamToShow === 'San Jose State' ? 
        ['San Jose State', 'San José State', 'SJSU', 'San Jose State Spartans'] :
        teamToShow === 'Hawai\'i' ? 
        ['Hawai\'i', 'Hawaii', 'Hawaiʻi'] : 
        teamToShow === 'McNeese State' ?
        ['McNeese', 'Mcneese', 'McNeese State', 'McNeese State Cowboys'] :  // Added more variations
        [teamToShow];
      
      // Add debug logging
      console.log('Looking for team variations:', teamVariations);
      
      const upcomingGames = sportsData
        .filter(game => {
          const gameDate = new Date(game.dayofgame);
          const isMatch = teamVariations.some(team => 
            game.hometeam.toLowerCase().includes(team.toLowerCase()) || 
            game.awayteam.toLowerCase().includes(team.toLowerCase())
          );
          
          // Debug logging for each game
          console.log('Checking game:', {
            game,
            isMatch,
            hometeam: game.hometeam,
            awayteam: game.awayteam
          });
          
          return gameDate >= now && isMatch;
        })
        .sort((a, b) => new Date(a.dayofgame) - new Date(b.dayofgame));
      
      console.log(`Filtered upcoming games for ${teamToShow}:`, upcomingGames);
      return upcomingGames;
    };

    // Get schedule by week
    const getScheduleByWeek = () => {
      if (!sportsData || sportsData.length === 0) {
        return [];
      }

      // Always return Utah State's schedule
      return sportsData
        .filter(game => game.hometeam === 'Utah State' || game.awayteam === 'Utah State')
        .sort((a, b) => new Date(a.dayofgame) - new Date(b.dayofgame));
    };

    const upcomingGames = getUpcomingGames();
    const scheduleByWeek = getScheduleByWeek();

    const getTeamOpponent = (teamName) => {
      if (!sportsData || sportsData.length === 0) {
        return null;
      }

      const weekNumber = parseInt(selectedWeek.replace('week', ''));
      const game = sportsData.find(game => {
        const gameDate = new Date(game.dayofgame);
        const gameWeek = game.week || 0;
        
        // If the game is before Week 1, assign it to Week 0
        const isWeekZeroGame = gameDate < new Date('2025-08-27'); // Week 1 starts on 8/27/2025
        const assignedWeek = isWeekZeroGame ? 0 : gameWeek;
        
        return assignedWeek === weekNumber && 
          (game.hometeam === teamName || game.awayteam === teamName);
      });

      if (!game) {
        return 'OFF';
      }

      // Show '@' for all teams when they're the away team
      return game.hometeam === teamName ? game.awayteam : `@ ${game.hometeam}`;
    };

    const getGameDateTime = (teamName) => {
      if (!sportsData || sportsData.length === 0) {
        return { date: null, time: null };
      }

      const weekNumber = parseInt(selectedWeek.replace('week', ''));
      const game = sportsData.find(game => {
        const gameDate = new Date(game.dayofgame);
        const gameWeek = game.week || 0;
        
        // If the game is before Week 1, assign it to Week 0
        const isWeekZeroGame = gameDate < new Date('2025-08-27'); // Week 1 starts on 8/27/2025
        const assignedWeek = isWeekZeroGame ? 0 : gameWeek;
        
        return assignedWeek === weekNumber && 
          (game.hometeam === teamName || game.awayteam === teamName);
      });

      if (!game) {
        return { date: '-', time: '-' };
      }

      return {
        date: new Date(game.dayofgame).toLocaleDateString(),
        time: game.timeofgame === '00:00:00' ? 'TBA' : game.timeofgame
      };
    };

    // Function to check if all downloaded checkboxes are checked for a team and week
    const getDownloadedStatus = (teamName, weekNumber) => {
      // First check if there's a game this week
      const weekNumberInt = parseInt(weekNumber);
      const game = sportsData.find(game => {
        const gameDate = new Date(game.dayofgame);
        const gameWeek = game.week || 0;
        
        // If the game is before Week 1, assign it to Week 0
        const isWeekZeroGame = gameDate < new Date('2025-08-27'); // Week 1 starts on 8/27/2025
        const assignedWeek = isWeekZeroGame ? 0 : gameWeek;
        
        return assignedWeek === weekNumberInt && 
          (game.hometeam === teamName || game.awayteam === teamName);
      });

      // If no game is found, it's a bye week
      if (!game) {
        return 'No Game';
      }

      const teamId = schoolOptions.find(school => school.label === teamName)?.value;
      if (!teamId || !checkboxes[teamId]) return 'Incomplete';

      const weekIndex = weekNumberInt - 1; // Convert week number to 0-based index
      const teamCheckboxes = checkboxes[teamId];

      const isComplete = 
        teamCheckboxes.offense[weekIndex] && 
        teamCheckboxes.defense[weekIndex] && 
        teamCheckboxes.kicks[weekIndex];

      return isComplete ? 'Complete' : 'Incomplete';
    };

    // Function to check if all resolved checkboxes are checked for a team and week
    const getResolvedStatus = (teamName, weekNumber) => {
      // First check if there's a game this week
      const weekNumberInt = parseInt(weekNumber);
      const game = sportsData.find(game => {
        const gameDate = new Date(game.dayofgame);
        const gameWeek = game.week || 0;
        
        // If the game is before Week 1, assign it to Week 0
        const isWeekZeroGame = gameDate < new Date('2025-08-27'); // Week 1 starts on 8/27/2025
        const assignedWeek = isWeekZeroGame ? 0 : gameWeek;
        
        return assignedWeek === weekNumberInt && 
          (game.hometeam === teamName || game.awayteam === teamName);
      });

      // If no game is found, it's a bye week
      if (!game) {
        return 'No Game';
      }

      const teamId = schoolOptions.find(school => school.label === teamName)?.value;
      if (!teamId || !checkboxes[teamId]) return 'Incomplete';

      const weekIndex = weekNumberInt - 1; // Convert week number to 0-based index
      const teamCheckboxes = checkboxes[teamId];

      const isComplete = 
        teamCheckboxes.resolvedOffense[weekIndex] && 
        teamCheckboxes.resolvedDefense[weekIndex] && 
        teamCheckboxes.resolvedKicks[weekIndex];

      return isComplete ? 'Complete' : 'Incomplete';
    };

    // Function to check if all TV checkboxes are checked for a team and week
    const getTVStatus = (teamName, weekNumber) => {
      // First check if there's a game this week
      const weekNumberInt = parseInt(weekNumber);
      const game = sportsData.find(game => {
        const gameDate = new Date(game.dayofgame);
        const gameWeek = game.week || 0;
        
        // If the game is before Week 1, assign it to Week 0
        const isWeekZeroGame = gameDate < new Date('2025-08-27'); // Week 1 starts on 8/27/2025
        const assignedWeek = isWeekZeroGame ? 0 : gameWeek;
        
        return assignedWeek === weekNumberInt && 
          (game.hometeam === teamName || game.awayteam === teamName);
      });

      // If no game is found, it's a bye week
      if (!game) {
        return 'No Game';
      }

      const teamId = schoolOptions.find(school => school.label === teamName)?.value;
      if (!teamId || !checkboxes[teamId]) return 'Incomplete';

      const weekIndex = weekNumberInt - 1; // Convert week number to 0-based index
      const teamCheckboxes = checkboxes[teamId];

      const isComplete = 
        teamCheckboxes.tvOffense[weekIndex] && 
        teamCheckboxes.tvDefense[weekIndex] && 
        teamCheckboxes.tvKicks[weekIndex];

      return isComplete ? 'Complete' : 'Incomplete';
    };

    // Add this function to get notes for a team and week
    const getNotes = (teamName, weekNumber) => {
      // Convert team name to the store key format
      const teamKey = schoolOptions.find(school => school.label === teamName)?.value;
      if (!teamKey || !gameNotes[teamKey]) return '';
      
      // Week number is 0-based in the store
      const weekIndex = parseInt(weekNumber) - 1;
      return gameNotes[teamKey][weekIndex] || '';
    };

    // Add this new component before the main OverviewP2 component
    const ExpandableNote = ({ note, isExpanded, onToggle }) => {
      if (!note) return <Text style={styles.notesText}>-</Text>;
                      
                      return (
        <TouchableOpacity onPress={onToggle} style={styles.expandableNoteContainer}>
          <View style={styles.noteContentContainer}>
            {isExpanded ? (
              <Text style={styles.notesText}>{note}</Text>
            ) : (
              <Text style={styles.notesText} numberOfLines={2} ellipsizeMode="tail">
                {note}
                </Text>
              )}
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowText}>
                {isExpanded ? '▼' : '▶'}
                      </Text>
                    </View>
                  </View>
        </TouchableOpacity>
      );
    };

    // Add this function to handle note expansion
    const toggleNoteExpansion = (teamName, weekNumber) => {
      const noteKey = `${teamName}-${weekNumber}`;
      setExpandedNotes(prev => ({
        ...prev,
        [noteKey]: !prev[noteKey]
      }));
    };
                    
                    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Progress Bar Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { width: `${progress * 100}%` }
                  ]}
                >
                  <LinearGradient
                    colors={['#FF0000', '#FFFF00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* School Selection Section */}
          <Card style={styles.card}>
            <Card.Title />
            <Card.Content style={styles.cardContent}>
              <View style={styles.dropdownsContainer}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Select School</Text>
                  <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                      <Button 
                        mode="outlined" 
                        onPress={() => setVisible(true)}
                        style={styles.dropdownButton}
                        contentStyle={styles.dropdownButtonContent}
                      >
                        {selectedSchool ? 
                          schoolOptions.find(school => school.value === selectedSchool)?.label 
                          : 'Select School'
                        }
                      </Button>
                    }
                  >
                    {schoolOptions.map((school) => (
                      <Menu.Item
                        key={school.value}
                        onPress={() => handleSchoolSelect(school.value)}
                        title={school.label}
                      />
                    ))}
                  </Menu>
                </View>

                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Select Schedule Week</Text>
                  <Menu
                    visible={weekVisible}
                    onDismiss={() => setWeekVisible(false)}
                    anchor={
                      <Button 
                        mode="outlined" 
                        onPress={() => setWeekVisible(true)}
                        style={styles.dropdownButton}
                        contentStyle={styles.dropdownButtonContent}
                      >
                        {selectedWeek ? 
                          weekOptions.find(week => week.value === selectedWeek)?.label 
                          : 'Select Week'
                        }
                      </Button>
                    }
                  >
                    {weekOptions.map((week) => (
                      <Menu.Item
                        key={week.value}
                        onPress={() => handleWeekSelect(week.value)}
                        title={week.label}
                      />
                    ))}
                  </Menu>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={!selectedSchool}
                textColor="#FFFFFF"
              >
                Continue
              </Button>
            </Card.Content>
          </Card>

          {/* Spacer to push games to bottom */}
          <View style={styles.spacer} />

          {/* Upcoming Games Section */}
          <Card style={styles.upcomingGamesCard}>
            <Card.Title 
              title={`Upcoming Games${selectedSchool ? 
                ` - ${schoolOptions.find(school => school.value === selectedSchool)?.label}` : 
                ' - Utah State'}`} 
              titleStyle={styles.upcomingGamesTitle}
            />
            <Card.Content>
              {sportsStatus === 'loading' ? (
                <Text style={styles.loadingText}>Loading games...</Text>
              ) : upcomingGames.length > 0 ? (
                <ScrollView 
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  style={styles.gamesScrollView}
                >
                  <View style={styles.gamesList}>
                    {upcomingGames.map((game, index) => {
                      const homeTeamInfo = getTeamInfo(game.hometeam);
                      const awayTeamInfo = getTeamInfo(game.awayteam);
                      
                      return (
                        <View key={index} style={styles.gameCard}>
                          <View style={styles.gameTeamsContainer}>
                            <View style={styles.teamContainer}>
                              <Image 
                                source={homeTeamInfo.logo}
                                style={styles.teamLogo}
                                resizeMode="contain"
                              />
                              <Text style={styles.teamName}>
                                {homeTeamInfo.name}
                              </Text>
                            </View>
                            <Text style={styles.vsText}>VS</Text>
                            <View style={styles.teamContainer}>
                              <Image 
                                source={awayTeamInfo.logo}
                                style={styles.teamLogo}
                                resizeMode="contain"
                              />
                              <Text style={styles.teamName}>
                                {awayTeamInfo.name}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.gameInfoContainer}>
                            <Text style={styles.gameDate}>
                              {new Date(game.dayofgame).toLocaleDateString()}
                            </Text>
                            <Text style={styles.gameTime}>
                              {game.timeofgame === '00:00:00' ? 'TBA' : game.timeofgame}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.noGamesText}>
                  {`No upcoming games found${selectedSchool ? 
                    ` for ${schoolOptions.find(school => school.value === selectedSchool)?.label}` : 
                    ' for Utah State'}`}
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Schedule Dashboard Section */}
          <Card style={styles.scheduleCard}>
            <Card.Title 
              title="Schedule Dashboard" 
              titleStyle={styles.scheduleTitle}
            />
            <Card.Content style={styles.scheduleContent}>
              {sportsStatus === 'loading' ? (
                <Text style={styles.loadingText}>Loading schedule...</Text>
              ) : scheduleByWeek.length > 0 ? (
                <View style={styles.scheduleTable}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Team</Text>
                    <Text style={styles.headerText}>Week {selectedWeek ? selectedWeek.replace('week', '') : '0'} Opponent</Text>
                    <Text style={styles.headerText}>Date</Text>
                    <Text style={styles.headerText}>Time</Text>
                    <Text style={styles.headerText}>Downloaded</Text>
                    <Text style={styles.headerText}>Resolved</Text>
                    <Text style={styles.headerText}>TV</Text>
                    <Text style={styles.headerText}>Notes</Text>
                  </View>
                  {/* Utah State Entry */}
                  <View style={styles.tableRow}>
                    <View style={styles.opponentColumn}>
                      <Text style={styles.scheduleText}>Utah State</Text>
                    </View>
                    <View style={styles.detailsColumn}>
                      <Text style={styles.scheduleText}>
                        {selectedWeek ? getTeamOpponent('Utah State') || 'OFF' : 'Select a Week'}
                      </Text>
                    </View>
                    <View style={styles.dateColumn}>
                      <Text style={styles.scheduleText}>
                        {selectedWeek ? getGameDateTime('Utah State').date || '-' : '-'}
                      </Text>
                    </View>
                    <View style={styles.timeColumn}>
                      <Text style={styles.scheduleText}>
                        {selectedWeek ? getGameDateTime('Utah State').time || '-' : '-'}
                      </Text>
                    </View>
                    <View style={styles.downloadedColumn}>
                      <Text style={[
                        styles.teamName,
                        getDownloadedStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                          ? styles.completeText 
                          : getDownloadedStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                          ? styles.noGameText
                          : styles.incompleteText
                      ]}>
                        {selectedWeek ? getDownloadedStatus('Utah State', parseInt(selectedWeek.replace('week', ''))) : '-'}
                      </Text>
                    </View>
                    <View style={styles.resolvedColumn}>
                      <Text style={[
                        styles.teamName,
                        getResolvedStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                          ? styles.completeText 
                          : getResolvedStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                          ? styles.noGameText
                          : styles.incompleteText
                      ]}>
                        {selectedWeek ? getResolvedStatus('Utah State', parseInt(selectedWeek.replace('week', ''))) : '-'}
                      </Text>
                    </View>
                    <View style={styles.tvColumn}>
                      <Text style={[
                        styles.teamName,
                        getTVStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                          ? styles.completeText 
                          : getTVStatus('Utah State', parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                          ? styles.noGameText
                          : styles.incompleteText
                      ]}>
                        {selectedWeek ? getTVStatus('Utah State', parseInt(selectedWeek.replace('week', ''))) : '-'}
                      </Text>
                    </View>
                    <View style={styles.notesColumn}>
                      <ExpandableNote
                        note={selectedWeek ? getNotes('Utah State', parseInt(selectedWeek.replace('week', ''))) : '-'}
                        isExpanded={expandedNotes[`Utah State-${selectedWeek?.replace('week', '')}`]}
                        onToggle={() => toggleNoteExpansion('Utah State', selectedWeek?.replace('week', ''))}
                      />
                    </View>
                  </View>
                  {scheduleByWeek.map((game, index) => {
                    const isHomeGame = game.hometeam === 'Utah State';
                    const opponent = isHomeGame ? game.awayteam : game.hometeam;
                    const opponentInfo = getTeamInfo(opponent);
                    
                    return (
                      <View key={index} style={styles.tableRow}>
                        <View style={styles.opponentColumn}>
                          <Text style={styles.scheduleText}>{opponentInfo.name}</Text>
                        </View>
                        <View style={styles.detailsColumn}>
                          <Text style={styles.scheduleText}>
                            {selectedWeek ? getTeamOpponent(opponentInfo.name) || 'OFF' : 'Select a Week'}
                          </Text>
                        </View>
                        <View style={styles.dateColumn}>
                          <Text style={styles.scheduleText}>
                            {selectedWeek ? getGameDateTime(opponentInfo.name).date || '-' : '-'}
                          </Text>
                        </View>
                        <View style={styles.timeColumn}>
                          <Text style={styles.scheduleText}>
                            {selectedWeek ? getGameDateTime(opponentInfo.name).time || '-' : '-'}
                          </Text>
                        </View>
                        <View style={styles.downloadedColumn}>
                          <Text style={[
                            styles.teamName,
                            getDownloadedStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                              ? styles.completeText 
                              : getDownloadedStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                              ? styles.noGameText
                              : styles.incompleteText
                          ]}>
                            {selectedWeek ? getDownloadedStatus(opponentInfo.name, parseInt(selectedWeek.replace('week', ''))) : '-'}
                          </Text>
                        </View>
                        <View style={styles.resolvedColumn}>
                          <Text style={[
                            styles.teamName,
                            getResolvedStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                              ? styles.completeText 
                              : getResolvedStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                              ? styles.noGameText
                              : styles.incompleteText
                          ]}>
                            {selectedWeek ? getResolvedStatus(opponentInfo.name, parseInt(selectedWeek.replace('week', ''))) : '-'}
                          </Text>
                        </View>
                        <View style={styles.tvColumn}>
                          <Text style={[
                            styles.teamName,
                            getTVStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'Complete' 
                              ? styles.completeText 
                              : getTVStatus(opponentInfo.name, parseInt(selectedWeek?.replace('week', '') || '0')) === 'No Game'
                              ? styles.noGameText
                              : styles.incompleteText
                          ]}>
                            {selectedWeek ? getTVStatus(opponentInfo.name, parseInt(selectedWeek.replace('week', ''))) : '-'}
                          </Text>
                        </View>
                        <View style={styles.notesColumn}>
                          <ExpandableNote
                            note={selectedWeek ? getNotes(opponentInfo.name, parseInt(selectedWeek.replace('week', ''))) : '-'}
                            isExpanded={expandedNotes[`${opponentInfo.name}-${selectedWeek?.replace('week', '')}`]}
                            onToggle={() => toggleNoteExpansion(opponentInfo.name, selectedWeek?.replace('week', ''))}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.noGamesText}>No games found in schedule</Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  } catch (err) {
    console.error('Error in OverviewP2:', err);
    return (
      <View style={[styles.container, { padding: 20 }]}>
        <Text style={{ color: 'red' }}>Something went wrong: {err.message}</Text>
      </View>
    );
  }
}