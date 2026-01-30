from django.db import models
from django import forms






#===================MODELS FOR SIGNU & SIGNIN ===================
class Signup(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    pass1 = models.CharField(max_length=255)
    pass2 = models.CharField(max_length=255)

def __str__(self):
        return f"Table {self.username} - {self.email} - {self.pass1} - {self.pass2}"


class SignupForm(forms.ModelForm):
    class Meta:
        model = Signup
        fields = [ 'username', 'email', 'pass1', 'pass2']



class Signin(models.Model):
    username = models.CharField(max_length=255)
    pass1 = models.CharField(max_length=255)

def __str__(self):
        return f"Table {self.username} - {self.pass1}"


class SigninForm(forms.ModelForm):
    class Meta:
        model = Signin
        fields = [ 'username', 'pass1',]

#=============== AUTHENTICATION ENDS HERE ==================










#=================Models for foods and breakfast=====================

class Breakfast(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
      
class Lunch(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class Supper(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    

class BreakfastForm(forms.ModelForm):
    class Meta:
        model = Breakfast
        fields = ['food_type', 'number_of_people', 'table_number']

class LunchForm(forms.ModelForm):
    class Meta:
        model = Lunch
        fields = ['food_type', 'number_of_people', 'table_number']

class SupperForm(forms.ModelForm):
    class Meta:
        model = Supper
        fields = ['food_type', 'number_of_people', 'table_number']

    number_of_people = forms.IntegerField(required=True, min_value=1)
    number_of_people = forms.IntegerField(required=True, min_value=1)
    






#=======================MODELS FOR THE DRINKS BEGIN FROM HERE======================

class Soda(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
      
class Water(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class Energydrink(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class Juices(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True) 
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class SodaForm(forms.ModelForm):
    class Meta:
        model = Soda
        fields = ['food_type', 'number_of_people', 'table_number']

class EnergydrinkForm(forms.ModelForm):
    class Meta:
        model = Energydrink
        fields = ['food_type', 'number_of_people', 'table_number']

class WaterForm(forms.ModelForm):
    class Meta:
        model = Water
        fields = ['food_type', 'number_of_people', 'table_number']
class JuicesForm(forms.ModelForm):
    class Meta:
        model = Juices
        fields = ['food_type', 'number_of_people', 'table_number']
    
    number_of_people = forms.IntegerField(required=True, min_value=1)
    number_of_people = forms.IntegerField(required=True, min_value=1)
    





#=======================MODELS FOR THE ALCOHOLIC DRINKS BEGIN FROM HERE======================

class Beers(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
      
class Wines(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class Whiskeys(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    

class BeersForm(forms.ModelForm):
    class Meta:
        model = Beers
        fields = ['food_type', 'number_of_people', 'table_number']

class WinesForm(forms.ModelForm):
    class Meta:
        model = Wines
        fields = ['food_type', 'number_of_people', 'table_number']

class WhiskeysForm(forms.ModelForm):
    class Meta:
        model = Whiskeys
        fields = ['food_type', 'number_of_people', 'table_number']

    number_of_people = forms.IntegerField(required=True, min_value=1)
    number_of_people = forms.IntegerField(required=True, min_value=1)







#============================= MODELS FOR THE FAST FOODS ===================================>
class Burgers(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class Taccos(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"

class Pizza(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.number_of_people}"
    
class Sand_Wich(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)   

    def __str__(self):
        return f"Table {self.table_number} - {self.number_of_people}"


class Chips(models.Model):
    table_number = models.IntegerField(null=False)
    food_type = models.CharField(max_length=255, null=False)
    number_of_people = models.IntegerField(null=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    timestamps = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)  
    def __str__(self):
        return f"Table {self.table_number} - {self.food_type}"
    
class ChipsForm(forms.ModelForm):
    class Meta:
        model = Chips
        fields = ['food_type', 'number_of_people', 'table_number']


class BurgerForm(forms.ModelForm):
    class Meta:
        model = Burgers
        fields = ['food_type', 'number_of_people', 'table_number']

class TaccosForm(forms.ModelForm):
    class Meta:
        model = Taccos
        fields = ['food_type', 'number_of_people', 'table_number']

class PizzaForm(forms.ModelForm):
    class Meta:
        model = Pizza
        fields = ['food_type', 'number_of_people', 'table_number']

class Sand_WichForm(forms.ModelForm):
    class Meta:
        model = Sand_Wich
        fields = ['food_type', 'number_of_people', 'table_number']




class CompletedOrder(models.Model):
    table_number = models.IntegerField()
    item_type = models.CharField(max_length=100)
    number_of_people = models.IntegerField(default=0)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamps = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order for Table {self.table_number}: {self.item_type} - ({self.price})"







#========== MODELS FOR THE ADMIN TO ADD ITEM BEGIN FROM HERE ============
            #============ MODELS FOR FOODS  ==================

class FoodItem(models.Model):
    CATEGORY_CHOICES = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Supper', 'Supper'),
    ]
    
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Choose Category')

    def __str__(self):
        return f"{self.name} ({self.category})"
 

class FoodItemForm(forms.ModelForm):
        class Meta:
            model = FoodItem
            fields = ['name', 'price', 'category']





#================== MODELS FOR SOFT DRINKS  ==================

class DrinksItem(models.Model):
    CATEGORY_CHOICES = [
        ('Water', 'Water'),
        ('Soda', 'Soda'),
        ('Juices', 'Juices'),
        ('Energy Drinks', 'Energy Drinks'),
    ]
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Choose Category')

    def __str__(self):
        return f"{self.name} ({self.category})"
 

class DrinksItemForm(forms.ModelForm):
        class Meta:
            model = DrinksItem
            fields = ['name', 'price', 'category']



#================== MODELS FOR ALCOHOLIC DRINKS  ==================

class alcoholicDrinksItem(models.Model):
    CATEGORY_CHOICES = [
        ('Beers', 'Beers'),
        ('Wines', 'Wines'),
        ('Whiskeys', 'Whiskeys'),
    ]
    
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=50, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Choose Category')

    def __str__(self):
        return f"{self.name} ({self.category})"
 

class alcoholicDrinksItemForm(forms.ModelForm):
        class Meta:
            model = alcoholicDrinksItem
            fields = ['name', 'price', 'category']



#=========================MODELS FOR FAST FOODS ======================>
class edit_fast_foodsItem(models.Model):
    CATEGORY_CHOICES = [
        ('Burgers', 'Burgers'),
        ('Taccos', 'Taccos'),
        ('Pizza', 'Pizza'),
        ('Sand Wiches', 'Sand Wiches'),
        ('Chips', 'Chips'),
    ]
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Choose Category')

    def __str__(self):
        return f"{self.name} ({self.category})"

class edit_fast_foodsItemForm(forms.ModelForm):
    class Meta:
        model = edit_fast_foodsItem  # Specify the model here
        fields = ['name', 'price', 'category']  

#================= MODELS FOR MESSSAGE NOTIFICATION=================

class Notification(models.Model):
    message = models.CharField(max_length=255)
    category = models.CharField(max_length=50)  # e.g., 'Water', 'Soda', 'Energy Drinks'
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message