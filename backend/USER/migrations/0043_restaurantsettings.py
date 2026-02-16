# Generated migration for RestaurantSettings

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('USER', '0042_beers_is_read_breakfast_is_read_burgers_is_read_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RestaurantSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currency_code', models.CharField(default='USD', max_length=10)),
                ('currency_symbol', models.CharField(default='$', max_length=10)),
            ],
            options={
                'verbose_name_plural': 'Restaurant settings',
            },
        ),
    ]
