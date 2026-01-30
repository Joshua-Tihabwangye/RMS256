"""
REST API Serializers for RMS256.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    FoodItem, DrinksItem, alcoholicDrinksItem, edit_fast_foodsItem,
    Breakfast, Lunch, Supper, Soda, Water, Juices, Energydrink,
    Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips,
    CompletedOrder,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


# Menu item serializers (read + admin write)
class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ("id", "name", "price", "category")


class DrinksItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinksItem
        fields = ("id", "name", "price", "category")


class AlcoholItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = alcoholicDrinksItem
        fields = ("id", "name", "price", "category")


class FastFoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = edit_fast_foodsItem
        fields = ("id", "name", "price", "category")


# Order placement payloads
class PlaceFoodOrderSerializer(serializers.Serializer):
    table_number = serializers.IntegerField(min_value=1)
    category = serializers.ChoiceField(choices=["Breakfast", "Lunch", "Supper"])
    item_name = serializers.CharField()
    number_of_people = serializers.IntegerField(min_value=1)


class PlaceDrinkOrderSerializer(serializers.Serializer):
    table_number = serializers.IntegerField(min_value=1)
    category = serializers.ChoiceField(
        choices=["Water", "Soda", "Juices", "Energy Drinks"]
    )
    item_name = serializers.CharField()
    number_of_people = serializers.IntegerField(min_value=1)


class PlaceAlcoholOrderSerializer(serializers.Serializer):
    table_number = serializers.IntegerField(min_value=1)
    category = serializers.ChoiceField(choices=["Beers", "Wines", "Whiskeys"])
    item_name = serializers.CharField()
    number_of_people = serializers.IntegerField(min_value=1)


class PlaceFastFoodOrderSerializer(serializers.Serializer):
    table_number = serializers.IntegerField(min_value=1)
    category = serializers.ChoiceField(
        choices=["Burgers", "Taccos", "Pizza", "Sand Wiches", "Chips"]
    )
    item_name = serializers.CharField()
    number_of_people = serializers.IntegerField(min_value=1)


# Order list serializers (admin)
class CompletedOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedOrder
        fields = (
            "id", "table_number", "item_type", "number_of_people",
            "category", "price", "timestamps"
        )


def _order_serializer_for_model(model):
    class DynamicOrderSerializer(serializers.ModelSerializer):
        class Meta:
            model = model
            fields = (
                "id", "table_number", "food_type", "number_of_people",
                "unit_price", "total_price", "timestamps", "is_read"
            )
    return DynamicOrderSerializer


# Auth
class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
