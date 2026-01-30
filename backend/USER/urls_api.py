"""
API URL configuration for RMS256 - consumed by React frontend.
"""
from django.urls import path
from . import views_api

urlpatterns = [
    # Auth
    path("auth/signup/", views_api.api_signup),
    path("auth/signin/", views_api.api_signin),
    path("auth/signout/", views_api.api_signout),
    path("auth/forgot-password/", views_api.api_forgot_password),
    path("auth/reset-password/", views_api.api_reset_password),
    # Menu (public)
    path("menu/food/", views_api.api_food_items),
    path("menu/drinks/", views_api.api_drinks_items),
    path("menu/alcohol/", views_api.api_alcohol_items),
    path("menu/fast-food/", views_api.api_fast_food_items),
    # Place order (public)
    path("orders/food/", views_api.api_place_food_order),
    path("orders/drinks/", views_api.api_place_drink_order),
    path("orders/alcohol/", views_api.api_place_alcohol_order),
    path("orders/fast-food/", views_api.api_place_fast_food_order),
    # Admin dashboard & chart
    path("admin/dashboard/", views_api.api_dashboard),
    path("admin/chart-data/", views_api.api_chart_data),
    # Admin order lists
    path("admin/orders/breakfast/", views_api.api_orders_breakfast),
    path("admin/orders/lunch/", views_api.api_orders_lunch),
    path("admin/orders/supper/", views_api.api_orders_supper),
    path("admin/orders/water/", views_api.api_orders_water),
    path("admin/orders/juices/", views_api.api_orders_juices),
    path("admin/orders/soda/", views_api.api_orders_soda),
    path("admin/orders/energydrink/", views_api.api_orders_energydrink),
    path("admin/orders/beers/", views_api.api_orders_beers),
    path("admin/orders/wines/", views_api.api_orders_wines),
    path("admin/orders/whiskeys/", views_api.api_orders_whiskeys),
    path("admin/orders/burgers/", views_api.api_orders_burgers),
    path("admin/orders/taccos/", views_api.api_orders_taccos),
    path("admin/orders/pizza/", views_api.api_orders_pizza),
    path("admin/orders/sand-wich/", views_api.api_orders_sand_wich),
    path("admin/orders/chips/", views_api.api_orders_chips),
    # Admin menu CRUD
    path("admin/menu/food/", views_api.api_food_items_admin),
    path("admin/menu/food/<int:pk>/", views_api.api_food_item_delete),
    path("admin/menu/drinks/", views_api.api_drinks_items_admin),
    path("admin/menu/drinks/<int:pk>/", views_api.api_drinks_item_delete),
    path("admin/menu/alcohol/", views_api.api_alcohol_items_admin),
    path("admin/menu/alcohol/<int:pk>/", views_api.api_alcohol_item_delete),
    path("admin/menu/fast-food/", views_api.api_fast_food_items_admin),
    path("admin/menu/fast-food/<int:pk>/", views_api.api_fast_food_item_delete),
]
