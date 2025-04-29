from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Game
from .serializers import UserSerializer, GameSerializer
from datetime import datetime
from django.db.models import Q

# User views
class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Game views
class GameListAPIView(APIView):
    def post(self, request):
        school = request.data.get('school')
        
        if not school or school == 'all':
            # Return all future games if no school specified
            games = Game.objects.filter(
                dayofgame__gte=datetime.now().date()
            ).order_by('dayofgame')
        else:
            # Handle team name variations
            if school.lower() in ['hawaii', 'hawai\'i', 'hawaiʻi']:
                # Search for all variations of Hawaii
                games = Game.objects.filter(
                    Q(hometeam__icontains='Hawai') |
                    Q(awayteam__icontains='Hawai')
                ).order_by('dayofgame')
            elif school.lower() in ['san jose state', 'san josé state', 'sjsu', 'san jose']:
                # Search for all variations of San Jose State
                games = Game.objects.filter(
                    Q(hometeam__icontains='San Jo') |
                    Q(awayteam__icontains='San Jo')
                ).order_by('dayofgame')
            elif school == 'Mcneese' or school == 'McNeese State' or school == 'McNeese State Cowboys':
                school = 'McNeese State'
                games = Game.objects.filter(
                    Q(hometeam__icontains=school) |
                    Q(awayteam__icontains=school)
                ).order_by('dayofgame')
            else:
                # Filter by school name with partial matching
                games = Game.objects.filter(
                    Q(hometeam__icontains=school) |
                    Q(awayteam__icontains=school)
                ).order_by('dayofgame')
        
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

class GameRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer