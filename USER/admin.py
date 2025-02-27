# myapp/admin.py
from django.contrib import admin
from .models import Water
from .models import Soda
from .models import  Energydrink
from .models import Juices
from .models import  Breakfast
from .models import Lunch
from .models import Supper
from .models import Beers
from .models import Wines
from .models import Whiskeys
from .models import Burgers
from .models import Taccos
from .models import Pizza
from .models import Sand_Wich
from .models import Chips


@admin.register(Juices)
class JuicesAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Water)
class WaterAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Soda)
class SodaAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Energydrink)
class EnergydrinkAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)   

@admin.register(Breakfast)
class BreakfastAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Lunch)
class LunchAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Supper)
class SupperAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Beers)
class BeersAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',) 

@admin.register(Wines)
class WinesAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)   

@admin.register(Whiskeys)
class WhiskeysAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',) 

@admin.register(Burgers)
class BurgerAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)

@admin.register(Taccos)
class TaccosAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)         
         
@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)      

@admin.register(Sand_Wich)
class Sand_WichAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)        
         
@admin.register(Chips)
class ChipsAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'food_type', 'number_of_people',)
    search_fields = ('food_type',)
    list_filter = ('table_number',)