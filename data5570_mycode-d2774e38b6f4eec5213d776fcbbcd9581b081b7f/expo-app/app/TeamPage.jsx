import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';
import SchoolPage from '../components/SchoolPage';
import { schools } from '../config/schools';
import { fetchSportsData } from '../state/sportsSlice';

export default function TeamPage() {
  const dispatch = useDispatch();
  const { school } = useLocalSearchParams();
  const schoolConfig = schools[school || 'utahState'];
  const sportsStatus = useSelector((state) => state.sports.status);

  useEffect(() => {
    // Always fetch all games data
    if (sportsStatus === 'idle') {
      dispatch(fetchSportsData('all'));
    }
  }, [dispatch, sportsStatus]);

  return (
    <SchoolPage 
      schoolId={schoolConfig.id}
      schoolName={schoolConfig.name}
    />
  );
}