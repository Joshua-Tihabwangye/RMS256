# Generated by Django 5.1.2 on 2025-03-05 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('USER', '0038_signin_signup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='category',
            field=models.CharField(choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Supper', 'Supper'), ('Water', 'Water'), ('Soda', 'Soda'), ('Juices', 'Juices'), ('Energy Drinks', 'Energy Drinks'), ('Beers', 'Beers'), ('Wines', 'Wines'), ('Whiskeys', 'Whiskeys')], max_length=50),
        ),
        migrations.AlterField(
            model_name='notification',
            name='message',
            field=models.TextField(),
        ),
    ]
