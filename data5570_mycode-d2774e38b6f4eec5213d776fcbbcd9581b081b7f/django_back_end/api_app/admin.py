from django.contrib import admin
from .models import User, Game

# Register your models here.
admin.site.register(User)

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('week', 'dayofgame', 'hometeam', 'awayteam', 'seasontype')
    list_filter = ('seasontype', 'week', 'dayofgame')
    search_fields = ('hometeam', 'awayteam')