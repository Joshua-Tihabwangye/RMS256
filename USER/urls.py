from django.contrib.auth import views as auth_views
from django.urls import path
from .views import chart_data
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('dashboard', views.dashboard, name='dashboard'),


    path('food', views.food, name='food'),
    path('softdrinks', views.softdrinks, name='softdrinks'),
    path('alcohol', views.alcohol, name='alcohol'),
    path('fast_foods', views.fast_foods, name='fast_foods'),


    path('breakfast', views.breakfast, name='breakfast'),
    path('lunch', views.lunch, name='lunch'),
    path('supper', views.supper, name='supper'),
    path('water', views.water, name='water'),
    path('juices', views.juices, name='juices'),
    path('soda', views.soda, name='soda'),
    path('energydrink', views.energydrink, name='energydrink'),
    path('beers', views.beers, name='beers'),
    path('wines', views.wines, name='wines'),
    path('whiskeys', views.whiskeys, name='whiskeys'),
    path('chips', views.chips, name='chips'),
    path('burgers', views.burgers, name='burgers'),
    path('taccos', views.taccos, name='taccos'),
    path('pizza', views.pizza, name='pizza'),
    path('sand_wich', views.sand_wich, name='sand_wich'),


    path('edit_foods', views.edit_foods, name='edit_foods'),
    path('edit_drinks', views.edit_drinks, name='edit_drinks'),
    path('edit_alcohol', views.edit_alcohol, name='edit_alcohol'),
    path('edit_fast_foods', views.edit_fast_foods, name='edit_fast_foods'),


    path('chart-data/', chart_data, name='chart_data'),



     # Password reset URLs
    path('reset-password/<uidb64>/<token>/', views.reset_password, name='reset_password'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
]