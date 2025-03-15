from django.shortcuts import redirect, render, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Breakfast, Lunch, Supper, Soda, Energydrink, Juices, Water, Wines, Whiskeys, Beers, Burgers, Taccos, Sand_Wich, Pizza, Chips 
from .models import FoodItem, FoodItemForm, DrinksItem, DrinksItemForm, alcoholicDrinksItem, alcoholicDrinksItemForm, edit_fast_foodsItem, edit_fast_foodsItemForm  
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Count
from itertools import chain
from django.utils.timezone import now, timedelta
from collections import defaultdict
from .models import Notification, Breakfast, Lunch, Supper, Soda, Water, Juices, Energydrink, Beers, Wines, Whiskeys

#Password reset imports
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib import messages
from django.conf import settings



from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.conf import settings



import pusher
from django.http import JsonResponse
from django.conf import settings
from .pusher_instance import pusher_client
import logging

from USER import models



# Initialize Pusher
pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_CONFIG["app_id"],
    key=settings.PUSHER_CONFIG["key"],
    secret=settings.PUSHER_CONFIG["secret"],
    cluster=settings.PUSHER_CONFIG["cluster"],
    ssl=settings.PUSHER_CONFIG["ssl"],
)


# Create your views here.
def index(request):
    return render(request, 'USER/index.html')

 


#============================ VIEWS FOR FOODS ========================

def food(request):
    breakfast_items = FoodItem.objects.filter(category='Breakfast')
    lunch_items = FoodItem.objects.filter(category='Lunch')
    supper_items = FoodItem.objects.filter(category='Supper')

    if request.method == 'POST':
        table_number = request.POST.get('table_number')
        order_placed = False
        errors_present = False

        # Handling breakfast
        if request.POST.get('food_item_check_1'):
            food_type = request.POST.get('food_item_type_1')
            number_of_people = request.POST.get('number_of_people_1', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Breakfast.objects.create(
                    table_number=int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
            )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Breakfast. Please fill in all fields correctly.')

        # Handling lunch
        if request.POST.get('food_item_check_2'):
            food_type = request.POST.get('food_item_type_2')
            number_of_people = request.POST.get('number_of_people_2', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Lunch.objects.create(
                    table_number=int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                Notification.objects.create(
                    message=f'New order for Lunch: {number_of_people} people at table {table_number}',
                    category='Lunch'
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Lunch. Please fill in all fields correctly.')

        # Handling supper
        if request.POST.get('food_item_check_3'):
            food_type = request.POST.get('food_item_type_3')
            number_of_people = request.POST.get('number_of_people_3', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Supper.objects.create(
                    table_number=int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                Notification.objects.create(
                    message=f'New order for Supper: {number_of_people} people at table {table_number}',
                    category='Supper'
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Supper. Please fill in all fields correctly.')

        if order_placed:
            messages.success(request, 'Your order has been placed successfully!')
        elif not errors_present:
            messages.error(request, 'Please provide valid details for the food item selected!')

    return render(request, 'USER/food.html', {
        'breakfast_items': breakfast_items,
        'lunch_items': lunch_items,
        'supper_items': supper_items,
    })







#==================== HANDLES THE ADMIN SIDE OF ADDING FOODS TO THE MENU  =================>
def edit_foods(request):
    food_items = FoodItem.objects.all()
    form = FoodItemForm()

    if request.method == 'POST':
        if 'add_food_item' in request.POST:
            form = FoodItemForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('edit_foods')
        elif 'delete_food_item' in request.POST:
            food_item_id = request.POST.get('food_item_id')
            food_item = get_object_or_404(FoodItem, id=food_item_id)
            food_item.delete()
            return redirect('edit_foods')

    context = {
        'food_items': food_items,
        'form': form,
    }
    return render(request, 'Admin/edit_foods.html', context)




#=========================== VIEWS FOR SOFT DRINKS ======================

def softdrinks(request):
    water_items = DrinksItem.objects.filter(category='Water')
    soda_items = DrinksItem.objects.filter(category='Soda')
    juice_items = DrinksItem.objects.filter(category='Juices')
    energy_drink_items = DrinksItem.objects.filter(category='Energy Drinks')

    if request.method == 'POST':
        table_number = request.POST.get('table_number')
        order_placed = False
        errors_present = False  # Track if any error message was added
       
        # Handling water
        if request.POST.get('food_item_check_1'):
            food_type = request.POST.get('food_item_type_1')
            number_of_people = request.POST.get('number_of_people_1', 0)
            category = "Water"

            if table_number and number_of_people and number_of_people.isdigit():
                Water.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)

                )

                 # Send notification to the admin
                message = f"New order for {food_type}: {number_of_people} people at table {table_number}"

                # Trigger Pusher event
                pusher_client.trigger(f'order-channel-Water', 'new-order-event', {
                 'message': message
                })
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Water. Please fill in all fields correctly.')

        # Handling soda
        if request.POST.get('food_item_check_2'):
            food_type = request.POST.get('food_item_type_2')
            number_of_people = request.POST.get('number_of_people_2', 0)
            category = "Soda"

            if table_number and number_of_people and number_of_people.isdigit():
                Soda.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                
                # # Send notification to the admin
                message = f"New order for {food_type}: {number_of_people} people at table {table_number}"

                # Trigger Pusher event
                pusher_client.trigger(f'order-channel-Soda', 'new-order-event', {
                 'message': message
                })

                order_placed = True
            else:
                errors_present = True
                

        # Handling juices
        if request.POST.get('food_item_check_3'):
            food_type = request.POST.get('food_item_type_3')
            number_of_people = request.POST.get('number_of_people_3', 0)
            category = "Juices"

            if table_number and number_of_people and number_of_people.isdigit():
                Juices.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                
                 # Send notification to the admin
                message = f"New order for {food_type}: {number_of_people} people at table {table_number}"

                try:
                    # Trigger Pusher event
                    pusher_client.trigger(f'order-Juices', 'new-order-event', {
                    'message': message
                    })
                except Exception as e:
                    logging.error(f"Pusher error: {e}")
                # You can also show a fallback message or continue silently

                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Juices. Please fill in all fields correctly.')

        # Handling energy drinks
        if request.POST.get('food_item_check_4'):
            food_type = request.POST.get('food_item_type_4')
            number_of_people = request.POST.get('number_of_people_4', 0)

            category = "Energydrinks"

            if table_number and number_of_people and number_of_people.isdigit():
                Energydrink.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                 # Send notification to the admin
                message = f"New order for {food_type}: {number_of_people} people at table {table_number}"

               # Trigger Pusher event
                pusher_client.trigger(f'order-channel-Energydrinks', 'new-order-event', {
                 'message': message
                })

                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Energy drinks. Please fill in all fields correctly.')

        # Check if at least one order was placed
        if order_placed:
            messages.success(request, 'Your order has been placed successfully!')
        elif not errors_present:  # Only add the generic error if any specific error messages were added
            messages.error(request, 'Please provide valid details for the food item selected! ')

    return render(request, 'USER/softdrinks.html', {
        'water_items': water_items,
        'soda_items': soda_items,
        'juice_items': juice_items,
        'energy_drink_items': energy_drink_items
    })

#==================== HANDLES THE ADMIN SIDE OF ADDING DRINKS TO THE MENU  =================>
def edit_drinks(request):
    drinks_items = DrinksItem.objects.all()
    form = DrinksItemForm()

    if request.method == 'POST':
        if 'add_drinks_item' in request.POST:
            form = DrinksItemForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('edit_drinks')
        elif 'delete_drinks_item' in request.POST:
            drinks_item_id = request.POST.get('drinks_item_id')  # Ensure ID is retrieved as 'drinks_item_id'
            drinks_item = get_object_or_404(DrinksItem, id=drinks_item_id)
            drinks_item.delete()
            return redirect('edit_drinks')

            
    context = {
        'drinks_items': drinks_items,
        'form': form,
    }
    return render(request, 'Admin/edit_drinks.html', context)





#================ VIEWS FOR ALCOHOLIC DRINKS ================
    
def alcohol(request):
    wines_items = alcoholicDrinksItem.objects.filter(category='Wines')
    beers_items = alcoholicDrinksItem.objects.filter(category='Beers')
    whiskeys_items = alcoholicDrinksItem.objects.filter(category='Whiskeys')

    if request.method == 'POST':
        table_number = request.POST.get('table_number')
        order_placed = False
        errors_present = False  # Track if any error message was added

        # Handling beers
        if request.POST.get('food_item_check_1'):
            food_type = request.POST.get('food_item_type_1')
            number_of_people = request.POST.get('number_of_people_1', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Beers.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Beers. Please fill in all fields correctly.')

        # Handling wines
        if request.POST.get('food_item_check_2'):
            food_type = request.POST.get('food_item_type_2')
            number_of_people = request.POST.get('number_of_people_2', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Wines.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Wines. Please fill in all fields correctly.')

        # Handling whiskeys
        if request.POST.get('food_item_check_3'):
            food_type = request.POST.get('food_item_type_3')
            number_of_people = request.POST.get('number_of_people_3', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Whiskeys.objects.create(
                    table_number= int(table_number),
                    food_type=food_type,
                    number_of_people=int(number_of_people)
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly.')

        # Check if an order was placed
        if order_placed:
            messages.success(request, 'Your order has been placed successfully!')
        elif not errors_present:  # Only add the generic error if no specific error messages were added
            messages.error(request, 'Please provide valid details for the food item selected! ')

    return render(request, 'USER/alcohol.html', {
        'beers_items': beers_items,
        'wines_items': wines_items,
        'whiskeys_items': whiskeys_items,
    })


#==================== HANDLES THE ADMIN SIDE OF ADDING DRINKS TO THE MENU  =================>
def edit_alcohol(request):
    alcoholicDrinks_items = alcoholicDrinksItem.objects.all()
    form = alcoholicDrinksItemForm()

    if request.method == 'POST':
        if 'add_alcoholicDrinks_item' in request.POST:
            form = alcoholicDrinksItemForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('edit_alcohol')
        elif 'delete_alcoholicDrinks_item' in request.POST:
            alcoholicDrinks_item_id = request.POST.get('alcoholicDrinks_item_id')  # Ensure ID is retrieved as 'drinks_item_id'
            alcoholicDrinks_item = get_object_or_404(alcoholicDrinksItem, id=alcoholicDrinks_item_id)
            alcoholicDrinks_item.delete()
            return redirect('edit_alcohol')

            
    context = {
        'alcoholicDrinks_items': alcoholicDrinks_items,
        'form': form,
    }
    return render(request, 'Admin/edit_alcohol.html', context)




#================ VIEWS FOR FAST FOODS DRINKS ================
def fast_foods(request):
    burgers_items = edit_fast_foodsItem.objects.filter(category='Burgers')
    taccos_items = edit_fast_foodsItem.objects.filter(category='Taccos')
    pizza_items = edit_fast_foodsItem.objects.filter(category='Pizza')
    sand_wich_items = edit_fast_foodsItem.objects.filter(category='Sand Wiches')
    chips_items = edit_fast_foodsItem.objects.filter(category='Chips')


    if request.method == 'POST':
        table_number = request.POST.get('table_number')
        order_placed = False    
        errors_present = False


    #-------------------  HANDLING BURGERS  --------------------->
        if request.POST.get('food_item_check_1'):
            food_type = request.POST.get('food_item_type_1')
            number_of_people = request.POST.get('number_of_people_1', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Burgers.objects.create(
                    food_type = food_type,
                    table_number = int(table_number),
                    number_of_people = int(number_of_people),
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly! ')


    #-------------------  HANDLING TACCOS  --------------------->
        if request.POST.get('food_item_check_2'):
            food_type = request.POST.get('food_item_type_2')
            number_of_people = request.POST.get('number_of_people_2', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Taccos.objects.create(
                    food_type = food_type,
                    table_number = int(table_number),
                    number_of_people = int(number_of_people),
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly! ')


    #-------------------  HANDLING PIZZA  --------------------->
        if request.POST.get('food_item_check_3'):
            food_type = request.POST.get('food_item_type_3')
            number_of_people = request.POST.get('number_of_people_3', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Pizza.objects.create(
                    food_type = food_type,
                    table_number = int(table_number),
                    number_of_people = int(number_of_people),
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly! ')


    #-------------------  HANDLING SAND WICH --------------------->
        if request.POST.get('food_item_check_4'):
            food_type = request.POST.get('food_item_type_4')
            number_of_people = request.POST.get('number_of_people_4')

            if table_number and number_of_people and number_of_people.isdigit():
                Sand_Wich.objects.create(
                    food_type = food_type,
                    table_number = int(table_number),
                    number_of_people = int(number_of_people),
                )
                order_placed = True
            else:
                errors_present = True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly! ')


#-------------------  HANDLING CHIPS --------------------->
        if request.POST.get('food_item_check_5'):
            food_type = request.POST.get('food_item_type_5')
            number_of_people = request.POST.get('number_of_people_5', 0)

            if table_number and number_of_people and number_of_people.isdigit():
                Chips.objects.create(
                    food_type = food_type,
                    table_number = int(table_number),
                    number_of_people = int(number_of_people)
                )
                order_placed = True
            else:
                errors_present =True
                messages.error(request, 'Invalid details for Whiskeys. Please fill in all fields correctly! ')

        if order_placed:
            messages.success(request, 'Your order has been placed successfully! ')
        elif not errors_present:
            messages.error(request, 'Please provide valid details for the food item selected! ')

    return render(request, 'USER/fast_foods.html',{
        'burgers_items':    burgers_items,
        'pizza_items':     pizza_items,
        'taccos_items':    taccos_items,
        'sand_wich_items': sand_wich_items,
        'chips_items':    chips_items,
    })
            

#==================== HANDLES THE ADMIN SIDE OF ADDING FAST FOODS TO THE MENU  =================>
def edit_fast_foods(request):
    fast_foods_items = edit_fast_foodsItem.objects.all()
    form = edit_fast_foodsItemForm()

    if request.method == 'POST':
        if 'add_edit_fast_foods_item' in request.POST:
            form = edit_fast_foodsItemForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('edit_fast_foods')
        elif 'delete_fast_foods_item' in request.POST:
            fast_foods_item_id = request.POST.get('fast_foods_item_id') 
            fast_foods_item = get_object_or_404(edit_fast_foodsItem, id=fast_foods_item_id)
            fast_foods_item.delete()
            return redirect('edit_fast_foods')

            
    context = {
        'fast_foods_items': fast_foods_items,
        'form': form,
    }
    return render(request, 'Admin/edit_fast_foods.html', context)









#======================ADMIN AUTHENTICATION BEGINS FROM HERE========================
def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        pass1 = request.POST.get('pass1')
        pass2 = request.POST.get('pass2')

        if not (username and pass1 and pass2 and email):
            messages.error(request, "All fields are required!")
            return render(request, 'Authentication/signup.html')

        if pass1 != pass2:
            messages.error(request, "Passwords do not match!")
            return render(request, 'Authentication/signup.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists!")
            return render(request, 'Authentication/signup.html')
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists!")
            return render(request, 'Authentication/signup.html')

        # Create the user
        user = User.objects.create_user(username=username, password=pass1, email=email)
        user.save()
        messages.success(request, "You have successfully signed up!")
        return redirect('signin')
    else:
        return render(request, 'Authentication/signup.html')


def signin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('pass1')

        user = authenticate(username=username, password=pass1)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password!")
            return render(request, 'Authentication/signin.html')
    else:
        return render(request, 'Authentication/signin.html')

 




#====================== PASSWORD RESET ===================================

# View to handle password reset form


def forgot_password(request):
    if request.method == "POST":
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.SITE_URL}/reset-password/{uidb64}/{token}/"
            
            # Send the reset link via email
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password:\n{reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            messages.success(request, "Password reset link has been sent to your email.")
            return redirect("forgot_password")
        except User.DoesNotExist:
            messages.error(request, "No account found with this email.")
    
    return render(request, "Registration/forgot_password.html")

def reset_password(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        if request.method == "POST":
            password = request.POST.get("password")
            confirm_password = request.POST.get("confirm_password")

            if password == confirm_password:
                user.password = make_password(password)
                user.save()
                messages.success(request, "Password reset successfully! You can now log in.")
                return redirect("signin")
            else:
                messages.error(request, "Passwords do not match.")

        return render(request, "Registration/reset_password.html", {"valid_link": True})
    else:
        messages.error(request, "Invalid or expired password reset link.")
        return render(request, "Registration/reset_password.html", {"valid_link": False})


#==========================User authentication ends here===============================






# views.py
def dashboard(request):
    today = now().date()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)

    models = [Breakfast, Lunch, Supper, Soda, Water, Juices, Energydrink, Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips]
    
    # Daily, weekly, monthly orders
    daily_orders = sum(model.objects.filter(timestamps__date=today).count() for model in models)
    weekly_orders = sum(model.objects.filter(timestamps__date__gte=start_of_week).count() for model in models)
    monthly_orders = sum(model.objects.filter(timestamps__date__gte=start_of_month).count() for model in models)

    # Most placed order logic
    order_data = []
    for model in models:
        orders = (
            model.objects.filter(timestamps__date__gte=start_of_month)
            .values('food_type')
            .annotate(order_count=Count('food_type'))
        )
        order_data.extend(orders)

    if order_data:
        combined_orders = {}
        for item in order_data:
            food_type = item['food_type']
            count = item['order_count']
            combined_orders[food_type] = combined_orders.get(food_type, 0) + count
        most_placed_order = max(combined_orders, key=combined_orders.get)
        most_placed_order_count = combined_orders[most_placed_order]
        most_placed_order = f"{most_placed_order} ({most_placed_order_count} orders)"
    else:
        most_placed_order = "No orders this month"

    # Unread notifications count by category
    unread_notifications_count_by_category = {
        'Soda': Soda.objects.filter(is_read=False).count(),
        'Water': Water.objects.filter(is_read=False).count(),
        'Juices': Juices.objects.filter(is_read=False).count(),
        'Energydrinks': Energydrink.objects.filter(is_read=False).count(),
        # Add other categories if needed (e.g., Beers, Wines, etc.)
    }

    # Combine all context data
    context = {
        'daily_orders': daily_orders,
        'weekly_orders': weekly_orders,
        'monthly_orders': monthly_orders,
        'most_placed_order': most_placed_order,
        'unread_notifications_count_by_category': unread_notifications_count_by_category,
    }
    
    return render(request, 'Admin/dashboard.html', context)



def chart_data(request):
    today = now().date()
    start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
    end_of_week = start_of_week + timedelta(days=6)  # Sunday of the current week
    start_of_month = today.replace(day=1)  # First day of the current month

    models = [Breakfast, Lunch, Supper, Water, Soda, Energydrink, Juices, Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips]
    daily_orders = defaultdict(int)
    category_totals = defaultdict(int)  # For pie chart
    weekly_orders = defaultdict(int)

    for model in models:
        # Filter orders for the current week only
        orders = model.objects.filter(timestamps__date__gte=start_of_week, timestamps__date__lte=end_of_week)
        for order in orders:
            day = order.timestamps.date().weekday()  # Map orders to the correct day (0 = Monday, ..., 6 = Sunday)
            daily_orders[day] += 1  # Accumulate daily orders for the current week
            category_totals[model.__name__] += 1  # Count orders by category for pie chart
            week = order.timestamps.isocalendar().week  # Map orders to the correct week number
            weekly_orders[week] += 1

    # Convert to a list of daily totals (Monday to Sunday)
    daily_totals = [daily_orders.get(i, 0) for i in range(7)]

     # Extract totals for weeks 1 to 4 of the month
    weekly_totals = [weekly_orders.get(week, 0) for week in range(start_of_month.isocalendar().week, start_of_month.isocalendar().week + 4)]


    # Prepare pie chart data (total orders per category)
    pie_chart_data = [{'category': key, 'total': value} for key, value in category_totals.items()]

    return JsonResponse({
        'daily_orders': daily_totals,
        'pie_chart_data': pie_chart_data,
        'weekly_orders': weekly_totals,
    })










def breakfast(request):
   
    # Fetch lunch items
    breakfast_items = Breakfast.objects.all()

    
    return render(request, 'Admin/breakfast.html', {
        'breakfast_items': breakfast_items,
        })



def lunch(request):
    # Mark only Lunch notifications as read
    Notification.objects.filter(is_read=False, category="Lunch").update(is_read=True)

    # Fetch lunch items
    lunch_items = Lunch.objects.all()

    # Count unread Lunch notifications
    unread_notifications_count = Notification.objects.filter(is_read=False, category="Lunch").count()

    return render(request, 'Admin/lunch.html', {
        'lunch_items': lunch_items,
        })


def supper(request):
    
    # Fetch lunch items
    supper_items = Supper.objects.all()

    
    return render(request, 'Admin/supper.html', {
        'supper_items': supper_items,
        })



def juices(request):
    
    # Fetch lunch items
    juices_items = Juices.objects.all()

    
    return render(request, 'Admin/juices.html', {
        'juices_items': juices_items,
        })


def soda(request):
    
    # Fetch lunch items
    soda_items = Soda.objects.all()

    
    return render(request, 'Admin/soda.html', {
        'soda_items': soda_items,
        })



def water(request):
    
    # Fetch lunch items
    water_items = Water.objects.all()

    
    return render(request, 'Admin/water.html', {
        'water_items': water_items,
        })



def energydrink(request):
    
    # Fetch lunch items
    energydrink_items = Energydrink.objects.all()

    
    return render(request, 'Admin/energydrink.html', {
        'energydrink_items': energydrink_items,
        })




def whiskeys(request):
    
    # Fetch lunch items
    whiskeys_items = Whiskeys.objects.all()

    
    return render(request, 'Admin/whiskeys.html', {
        'whiskeys_items': whiskeys_items,
        })

def beers(request):
    
    # Fetch soda items and any other necessary data
    beers_items = Beers.objects.all() 

    
    return render(request, 'Admin/beers.html', {
        'beers_items': beers_items,
        })

def wines(request):
    
    # Fetch soda items and any other necessary data
    wines_items = Wines.objects.all() 

    
    return render(request, 'Admin/wines.html', {
        'wines_items': wines_items,
        })



def chips(request):

    # Fetch lunch items
    chips_items = Chips.objects.all()

   
    return render(request, 'Admin/chips.html', {
        'chips_items': chips_items,
       })

def taccos(request):
   
    # Fetch lunch items
    taccos_items = Taccos.objects.all()

    
    return render(request, 'Admin/taccos.html', {
        'taccos_items': taccos_items,
       })

def burgers(request):
   
    # Fetch lunch items
    burgers_items = Burgers.objects.all()

    return render(request, 'Admin/burgers.html', {
        'burgers_items': burgers_items,
        })

def pizza(request):
   
    # Fetch lunch items
    pizza_items = Pizza.objects.all()

    return render(request, 'Admin/pizza.html', {
        'pizza_items': pizza_items,
        })

def sand_wich(request):

       # Fetch lunch items
    sand_wich_items = Sand_Wich.objects.all()

    return render(request, 'Admin/sand_wich.html', {
        'sand_wich_items': sand_wich_items,
        })



def signout(request):
    return render(request, "Admin/signout.html")


