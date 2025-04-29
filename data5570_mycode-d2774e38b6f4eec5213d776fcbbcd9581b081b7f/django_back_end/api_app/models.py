from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)  # email is optional
    school = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Game(models.Model):
    week = models.IntegerField()
    seasontype = models.CharField(max_length=20)
    dayofgame = models.DateField()
    timeofgame = models.TimeField()
    isstarttimetbd = models.BooleanField(default=False)
    hometeam = models.CharField(max_length=100)
    homemascot = models.CharField(max_length=100)
    awayteam = models.CharField(max_length=100)
    awaymascot = models.CharField(max_length=100)

    def __str__(self):
        return f"Week {self.week}: {self.awayteam} @ {self.hometeam}"


## Columns for game data
## Week, seasontype, dayofgame, timeofgame, isstarttimetbd, hometeam,
## homemascot, awayteam, awaymascot, 