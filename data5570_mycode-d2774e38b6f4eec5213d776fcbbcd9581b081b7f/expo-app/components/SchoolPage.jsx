import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Checkbox, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckbox } from '../state/checkboxSlice';
import { updateGameNote } from '../state/gameNotesSlice';
import { setGames } from '../state/gamesSlice';
import { fetchSportsData } from '../state/sportsSlice';

const getTeamVariations = (schoolName) => {
  switch(schoolName) {
    case 'San Jose State':
      return ['San Jose State', 'San José State', 'SJSU', 'San Jose State Spartans'];
    case 'Hawai\'i':
      return ['Hawai\'i', 'Hawaii', 'Hawaiʻi'];
    case 'McNeese State':
      // Make the matching more flexible by using shorter/partial names
      return ['McNeese', 'Mcneese'];  // Simplified to catch more variations
    default:
      return [schoolName];
  }
};

const isTeamMatch = (teamName, schoolName) => {
  const variations = getTeamVariations(schoolName);
  return variations.some(variation => teamName === variation);
};

const normalizeSchoolName = (name) => {
  // Map of special cases
  const specialCases = {
    'hawaii': 'Hawai\'i',
    'utahState': 'Utah State',
    'texasAM': 'Texas A&M',
    'airForce': 'Air Force',
    'mcneeseState': 'McNeese State',
    'vanderbilt': 'Vanderbilt',
    'sanJoseState': 'San Jose State',
    'newMexico': 'New Mexico',
    'nevada': 'Nevada',
    'unlv': 'UNLV',
    'fresnoState': 'Fresno State',
    'boiseState': 'Boise State',
  };

  return specialCases[name] || name;
};

export default function SchoolPage({ schoolId, schoolName }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const checkedItems = useSelector((state) => state.checkboxes[schoolId] || {
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
  const gameNotes = useSelector((state) => state.gameNotes[schoolId] || {});
  const gameData = useSelector((state) => state.games[schoolId] || []);
  const sportsData = useSelector((state) => state.sports.sportsData);
  const sportsStatus = useSelector((state) => state.sports.status);
  const sportsError = useSelector((state) => state.sports.error);

  // Add console logs
  console.log('SchoolPage - Sports Status:', sportsStatus);
  console.log('SchoolPage - Sports Data:', sportsData);
  console.log('SchoolPage - Sports Error:', sportsError);
  console.log('SchoolPage - School Name:', schoolName);

  const handleCheck = (category, index) => {
    const newValue = !checkedItems[category][index];
    dispatch(updateCheckbox({
      school: schoolId,
      category,
      index,
      value: newValue
    }));
  };

  const handleNoteChange = (index, value) => {
    dispatch(updateGameNote({
      school: schoolId,
      index,
      note: value
    }));
  };

  useEffect(() => {
    const normalizedName = normalizeSchoolName(schoolId);
    dispatch(fetchSportsData(normalizedName));
  }, [dispatch, schoolId]);

  // Add debug logging
  console.log('Raw Sports Data:', sportsData);

  const sortedSportsData = [...(sportsData || [])]
    .filter(game => {
      const teamVariations = getTeamVariations(schoolName);
      // Make the matching more flexible by using includes() instead of exact match
      const isMatch = teamVariations.some(variation => 
        game.hometeam.toLowerCase().includes(variation.toLowerCase()) || 
        game.awayteam.toLowerCase().includes(variation.toLowerCase())
      );
      
      // Debug logging for each game
      console.log('Checking game:', {
        game,
        teamVariations,
        isMatch,
        hometeam: game.hometeam,
        awayteam: game.awayteam
      });
      
      return isMatch;
    })
    .sort((a, b) => new Date(a.dayofgame) - new Date(b.dayofgame));

  // Log the filtered results
  console.log('Filtered Sports Data for McNeese:', sortedSportsData);

  // Process the data to add OFF weeks
  const processedGameData = [];
  if (sortedSportsData.length > 0) {
    let currentDate = new Date(sortedSportsData[0].dayofgame);
    processedGameData.push(sortedSportsData[0]);

    for (let i = 1; i < sortedSportsData.length; i++) {
      const nextDate = new Date(sortedSportsData[i].dayofgame);
      const daysBetween = Math.floor((nextDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (daysBetween > 7) {
        processedGameData.push({
          isOffWeek: true,
          dayofgame: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
      
      processedGameData.push(sortedSportsData[i]);
      currentDate = nextDate;
    }
  }

  // Add console log to debug the processed data
  console.log('Processed Game Data:', processedGameData);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    headerContainer: {
      padding: 10,
      paddingBottom: 0,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 10,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 10,
    },
    mainColumnsWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginLeft: 5,
      marginTop: 5,
      flex: 1,
    },
    columnsWrapper: {
      marginRight: 2,
    },
    downloadedContainer: {
      backgroundColor: '#FFE4B5',
      padding: 10,
      borderRadius: 5,
      width: 260,
      marginBottom: 5,
    },
    downloadedHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Times New Roman',
    },
    columnsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 20,
    },
    column: {
      width: 80,
      marginRight: 10,
      paddingVertical: 5,
    },
    columnTitle: {
      color: '#1a237e',
      textAlign: 'center',
      fontSize: 12,
      paddingVertical: 8,
      marginBottom: 0,
    },
    cardContent: {
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 2,
      justifyContent: 'center',
      height: 40,
    },
    resolvedContainer: {
      backgroundColor: '#98FB98',
      padding: 10,
      borderRadius: 5,
      width: 260,
      marginBottom: 5,
    },
    resolvedHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Times New Roman',
    },
    resolvedColumn: {
      backgroundColor: '#98FB98',
    },
    tvContainer: {
      backgroundColor: '#ADD8E6',
      padding: 10,
      borderRadius: 5,
      width: 260,
      marginBottom: 5,
    },
    tvHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Times New Roman',
    },
    tvColumn: {
      backgroundColor: '#ADD8E6',
    },
    infoContainer: {
      backgroundColor: '#E6E6FA',
      padding: 10,
      borderRadius: 5,
      width: 734,
      marginBottom: 5,
    },
    infoColumn: {
      width: 112,
      marginRight: 10,
      backgroundColor: '#E6E6FA',
      paddingVertical: 5,
    },
    infoCell: {
      marginVertical: 2,
      height: 40.3,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    input: {
      height: 40,
      fontSize: 12,
      backgroundColor: 'white',
      paddingHorizontal: 8,
      color: '#000000',
    },
    readOnlyText: {
      fontSize: 15,
      textAlign: 'center',
      color: '#000000',
      paddingVertical: 10,
    },
    infoHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      fontFamily: 'Times New Roman',
    },
    offenseColumn: {
      backgroundColor: '#FFE4B5',
    },
    defenseColumn: {
      backgroundColor: '#FFE4B5',
    },
    kicksColumn: {
      backgroundColor: '#FFE4B5',
    },
    opponentColumn: {
      width: 180,
    },
    notesColumn: {
      width: 300,
    },
    loadingText: {
      textAlign: 'center',
      padding: 20,
      color: '#666',
      fontSize: 16,
    },
    errorText: {
      textAlign: 'center',
      padding: 20,
      color: 'red',
      fontSize: 16,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{schoolName}</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.container}>
            {/* Loading or Error State */}
            {sportsStatus === 'loading' && (
              <Text style={styles.loadingText}>Loading game data...</Text>
            )}
            
            {sportsStatus === 'failed' && (
              <Text style={styles.errorText}>Error loading games: {sportsError}</Text>
            )}

            {/* Main Columns Section */}
            <View style={styles.mainColumnsWrapper}>
              {/* Downloaded Section */}
              <View style={styles.columnsWrapper}>
                <View style={styles.downloadedContainer}>
                  <Text style={styles.downloadedHeader}>Downloaded</Text>
                </View>
                <View style={styles.columnsContainer}>
                  {/* Orange Columns */}
                  <Card style={[styles.column, styles.offenseColumn]}>
                    <Card.Title 
                      title="Offense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`offense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.offense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('offense', index)}
                            color="#FFA07A"
                            uncheckedColor="#CC5500"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.defenseColumn]}>
                    <Card.Title 
                      title="Defense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`defense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.defense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('defense', index)}
                            color="#FFA07A"
                            uncheckedColor="#CC5500"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.kicksColumn]}>
                    <Card.Title 
                      title="Kicks" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`kicks-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.kicks[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('kicks', index)}
                            color="#FFA07A"
                            uncheckedColor="#CC5500"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                </View>
              </View>

              {/* Resolved Section */}
              <View style={styles.columnsWrapper}>
                <View style={styles.resolvedContainer}>
                  <Text style={styles.resolvedHeader}>Resolved</Text>
                </View>
                <View style={styles.columnsContainer}>
                  <Card style={[styles.column, styles.resolvedColumn]}>
                    <Card.Title 
                      title="Offense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`resolved-offense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.resolvedOffense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('resolvedOffense', index)}
                            color={checkedItems.resolvedOffense[index] ? '#32CD32' : '#98FB98'}
                            uncheckedColor="#006400"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.resolvedColumn]}>
                    <Card.Title 
                      title="Defense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`resolved-defense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.resolvedDefense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('resolvedDefense', index)}
                            color={checkedItems.resolvedDefense[index] ? '#32CD32' : '#98FB98'}
                            uncheckedColor="#006400"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.resolvedColumn]}>
                    <Card.Title 
                      title="Kicks" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`resolved-kicks-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.resolvedKicks[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('resolvedKicks', index)}
                            color={checkedItems.resolvedKicks[index] ? '#32CD32' : '#98FB98'}
                            uncheckedColor="#006400"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                </View>
              </View>

              {/* TV Section */}
              <View style={styles.columnsWrapper}>
                <View style={styles.tvContainer}>
                  <Text style={styles.tvHeader}>TV</Text>
                </View>
                <View style={styles.columnsContainer}>
                  <Card style={[styles.column, styles.tvColumn]}>
                    <Card.Title 
                      title="Offense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`tv-offense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.tvOffense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('tvOffense', index)}
                            color={checkedItems.tvOffense[index] ? '#4169E1' : '#ADD8E6'}
                            uncheckedColor="#000080"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.tvColumn]}>
                    <Card.Title 
                      title="Defense" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`tv-defense-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.tvDefense[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('tvDefense', index)}
                            color={checkedItems.tvDefense[index] ? '#4169E1' : '#ADD8E6'}
                            uncheckedColor="#000080"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  <Card style={[styles.column, styles.tvColumn]}>
                    <Card.Title 
                      title="Kicks" 
                      titleStyle={styles.columnTitle}
                      titleVariant="titleSmall"
                    />
                    <Card.Content style={styles.cardContent}>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`tv-kicks-${index}`} style={styles.checkboxContainer}>
                          <Checkbox
                            status={checkedItems.tvKicks[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck('tvKicks', index)}
                            color={checkedItems.tvKicks[index] ? '#4169E1' : '#ADD8E6'}
                            uncheckedColor="#000080"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                </View>
              </View>

              {/* Info Section */}
              <View style={styles.columnsWrapper}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoHeader}>Game Information</Text>
                </View>
                <View style={styles.columnsContainer}>
                  {/* Date Column */}
                  <Card style={[styles.column, styles.infoColumn]}>
                    <Card.Title title="Date" titleStyle={styles.columnTitle} />
                    <Card.Content>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`date-${index}`} style={styles.infoCell}>
                          <Text style={styles.readOnlyText}>
                            {processedGameData[index] ? 
                              (processedGameData[index].isOffWeek ? 
                                new Date(processedGameData[index].dayofgame).toLocaleDateString() : 
                                new Date(processedGameData[index].dayofgame).toLocaleDateString()) 
                              : '-'}
                          </Text>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  {/* Time Column */}
                  <Card style={[styles.column, styles.infoColumn]}>
                    <Card.Title title="Time" titleStyle={styles.columnTitle} />
                    <Card.Content>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`time-${index}`} style={styles.infoCell}>
                          <Text style={styles.readOnlyText}>
                            {processedGameData[index]?.timeofgame === '00:00:00' || !processedGameData[index]?.timeofgame ? 
                              'TBA' : 
                              processedGameData[index].timeofgame}
                          </Text>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  {/* Opponent Column */}
                  <Card style={[styles.column, styles.infoColumn, styles.opponentColumn]}>
                    <Card.Title title="Opponent" titleStyle={styles.columnTitle} />
                    <Card.Content>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`opponent-${index}`} style={styles.infoCell}>
                          <Text style={styles.readOnlyText}>
                            {processedGameData[index] ? 
                              (processedGameData[index].isOffWeek ? 
                                'OFF' : 
                                (isTeamMatch(processedGameData[index].hometeam, schoolName) ? 
                                  processedGameData[index].awayteam : 
                                  `@ ${processedGameData[index].hometeam}`)) 
                              : '-'}
                          </Text>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>

                  {/* Notes Column */}
                  <Card style={[styles.column, styles.infoColumn, styles.notesColumn]}>
                    <Card.Title title="Notes" titleStyle={styles.columnTitle} />
                    <Card.Content>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <View key={`notes-${index}`} style={styles.infoCell}>
                          <TextInput
                            dense
                            mode="flat"
                            style={styles.input}
                            value={gameNotes[index] || ''}
                            onChangeText={(value) => handleNoteChange(index, value)}
                            placeholder="Add note"
                            textColor="#000000"
                            placeholderTextColor="#D3D3D3"
                          />
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
