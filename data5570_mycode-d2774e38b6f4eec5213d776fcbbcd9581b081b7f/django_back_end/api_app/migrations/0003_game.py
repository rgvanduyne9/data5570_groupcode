# Generated by Django 5.2 on 2025-04-09 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_app', '0002_rename_favorite_color_user_school'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week', models.IntegerField()),
                ('seasontype', models.CharField(max_length=20)),
                ('dayofgame', models.DateField()),
                ('timeofgame', models.TimeField()),
                ('isstarttimetbd', models.BooleanField(default=False)),
                ('hometeam', models.CharField(max_length=100)),
                ('homemascot', models.CharField(max_length=100)),
                ('awayteam', models.CharField(max_length=100)),
                ('awaymascot', models.CharField(max_length=100)),
            ],
        ),
    ]
