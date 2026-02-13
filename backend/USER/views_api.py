"""
REST API views for RMS256 - consumed by React frontend.
"""
import logging
from django.utils.timezone import now, timedelta
from django.db.models import Sum, Count
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    FoodItem, DrinksItem, alcoholicDrinksItem, edit_fast_foodsItem,
    Breakfast, Lunch, Supper, Soda, Water, Juices, Energydrink,
    Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips,
    CompletedOrder,
)
from .serializers import (
    FoodItemSerializer, DrinksItemSerializer, AlcoholItemSerializer,
    FastFoodItemSerializer,
    PlaceFoodOrderSerializer, PlaceDrinkOrderSerializer,
    PlaceAlcoholOrderSerializer, PlaceFastFoodOrderSerializer,
    CompletedOrderSerializer, UserSerializer,
    SignUpSerializer, SignInSerializer,
)
from .views import save_completed_order
from .pusher_instance import pusher_client

logger = logging.getLogger(__name__)

ORDER_MODELS = {
    "Breakfast": Breakfast,
    "Lunch": Lunch,
    "Supper": Supper,
    "Water": Water,
    "Soda": Soda,
    "Juices": Juices,
    "Energydrink": Energydrink,
    "Beers": Beers,
    "Wines": Wines,
    "Whiskeys": Whiskeys,
    "Burgers": Burgers,
    "Taccos": Taccos,
    "Pizza": Pizza,
    "Sand_Wich": Sand_Wich,
    "Chips": Chips,
}

CATEGORY_TO_ITEM_MODEL = {
    "Breakfast": FoodItem,
    "Lunch": FoodItem,
    "Supper": FoodItem,
    "Water": DrinksItem,
    "Soda": DrinksItem,
    "Juices": DrinksItem,
    "Energy Drinks": DrinksItem,
    "Energydrink": DrinksItem,
    "Beers": alcoholicDrinksItem,
    "Wines": alcoholicDrinksItem,
    "Whiskeys": alcoholicDrinksItem,
    "Burgers": edit_fast_foodsItem,
    "Taccos": edit_fast_foodsItem,
    "Pizza": edit_fast_foodsItem,
    "Sand Wiches": edit_fast_foodsItem,
    "Sand_Wich": edit_fast_foodsItem,
    "Chips": edit_fast_foodsItem,
}


# ----- Auth -----
@api_view(["POST"])
@permission_classes([AllowAny])
def api_signup(request):
    ser = SignUpSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=ser.validated_data["username"]).exists():
        return Response(
            {"username": ["A user with that username already exists."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if User.objects.filter(email=ser.validated_data["email"]).exists():
        return Response(
            {"email": ["A user with that email already exists."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = ser.save()
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_signin(request):
    ser = SignInSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(
        username=ser.validated_data["username"],
        password=ser.validated_data["password"],
    )
    if user is None:
        return Response(
            {"detail": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response(
            {"email": ["This field is required."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"detail": "No account found with this email."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password/{uidb64}/{token}"
    try:
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        logger.exception("Send mail failed: %s", e)
        return Response(
            {"detail": "Failed to send email. Try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({"detail": "Password reset link has been sent to your email."})


@api_view(["POST"])
@permission_classes([AllowAny])
def api_reset_password(request):
    uidb64 = request.data.get("uidb64")
    token = request.data.get("token")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")
    if not all([uidb64, token, password, confirm_password]):
        return Response(
            {"detail": "All fields are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if password != confirm_password:
        return Response(
            {"detail": "Passwords do not match."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response(
            {"detail": "Invalid or expired reset link."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not default_token_generator.check_token(user, token):
        return Response(
            {"detail": "Invalid or expired reset link."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.password = make_password(password)
    user.save()
    return Response({"detail": "Password reset successfully. You can now log in."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_signout(request):
    try:
        refresh = request.data.get("refresh")
        if refresh:
            token = RefreshToken(refresh)
            try:
                token.blacklist()
            except Exception:
                pass
    except Exception:
        pass
    logout(request)
    return Response({"detail": "Logged out."})


# ----- Menu (public) -----
@api_view(["GET"])
@permission_classes([AllowAny])
def api_food_items(request):
    items = FoodItem.objects.all().order_by("category", "name")
    return Response(FoodItemSerializer(items, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def api_drinks_items(request):
    items = DrinksItem.objects.all().order_by("category", "name")
    return Response(DrinksItemSerializer(items, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def api_alcohol_items(request):
    items = alcoholicDrinksItem.objects.all().order_by("category", "name")
    return Response(AlcoholItemSerializer(items, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def api_fast_food_items(request):
    items = edit_fast_foodsItem.objects.all().order_by("category", "name")
    return Response(FastFoodItemSerializer(items, many=True).data)


# ----- Place order (public) -----
def _place_order(request, serializer_class, item_model_map, pusher_channel_map):
    ser = serializer_class(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    data = ser.validated_data
    category = data["category"]
    # Item model: for food one per category, for drinks/alcohol/fast_food one per category
    item_model = item_model_map.get(category) or item_model_map.get(list(item_model_map.keys())[0])
    if not item_model:
        return Response(
            {"category": [f"Unknown category: {category}"]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    obj = item_model.objects.filter(
        name=data["item_name"],
        category=category,
    ).first()
    if not obj:
        return Response(
            {"item_name": [f"Item '{data['item_name']}' not found in {category}."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    table_number = data["table_number"]
    num_people = data["number_of_people"]
    unit_price = obj.price
    total_price = unit_price * num_people
    order_model = ORDER_MODELS.get(
        "Energydrink" if category == "Energy Drinks" else ("Sand Wiches" if category == "Sand Wiches" else category)
    )
    if not order_model:
        return Response(
            {"category": [f"Order model not found for {category}"]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    order_model.objects.create(
        table_number=table_number,
        food_type=data["item_name"],
        number_of_people=num_people,
        unit_price=unit_price,
        total_price=total_price,
    )
    save_completed_order(
        str(table_number),
        data["item_name"],
        str(num_people),
        "Energydrink" if category == "Energy Drinks" else ("Sand_Wich" if category == "Sand Wiches" else category),
    )
    channel_name = pusher_channel_map.get(category) or f"order-channel-{category}"
    try:
        pusher_client.trigger(
            channel_name,
            "new-order-event",
            {"message": f"New order for {data['item_name']}: {num_people} at table {table_number}"},
        )
    except Exception as e:
        logger.error("Pusher error: %s", e)
    return Response({"detail": "Order placed successfully."}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def api_place_food_order(request):
    return _place_order(
        request,
        PlaceFoodOrderSerializer,
        {
            "Breakfast": FoodItem,
            "Lunch": FoodItem,
            "Supper": FoodItem,
        },
        {"Breakfast": "order-channel-Breakfast", "Lunch": "order-channel-Lunch", "Supper": "order-channel-Supper"},
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_place_drink_order(request):
    return _place_order(
        request,
        PlaceDrinkOrderSerializer,
        {"Water": DrinksItem, "Soda": DrinksItem, "Juices": DrinksItem, "Energy Drinks": DrinksItem},
        {},
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_place_alcohol_order(request):
    return _place_order(
        request,
        PlaceAlcoholOrderSerializer,
        {"Beers": alcoholicDrinksItem, "Wines": alcoholicDrinksItem, "Whiskeys": alcoholicDrinksItem},
        {"Beers": "order-channel-Beers", "Wines": "order-channel-Wines", "Whiskeys": "order-channel-Whiskeys"},
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_place_fast_food_order(request):
    return _place_order(
        request,
        PlaceFastFoodOrderSerializer,
        {
            "Burgers": edit_fast_foodsItem,
            "Taccos": edit_fast_foodsItem,
            "Pizza": edit_fast_foodsItem,
            "Sand Wiches": edit_fast_foodsItem,
            "Chips": edit_fast_foodsItem,
        },
        {
            "Burgers": "order-channel-Burgers",
            "Taccos": "order-channel-Taccos",
            "Pizza": "order-channel-Pizza",
            "Sand Wiches": "order-channel-Sand_Wich",
            "Chips": "order-channel-Chips",
        },
    )


# ----- Admin: dashboard -----
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_dashboard(request):
    today = now().date()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)
    models_list = [
        Breakfast, Lunch, Supper, Soda, Water, Juices, Energydrink,
        Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips,
    ]
    daily_orders = sum(m.objects.filter(timestamps__date=today).count() for m in models_list)
    weekly_orders = sum(m.objects.filter(timestamps__date__gte=start_of_week).count() for m in models_list)
    monthly_orders = sum(m.objects.filter(timestamps__date__gte=start_of_month).count() for m in models_list)
    order_data = []
    for m in models_list:
        order_data.extend(
            m.objects.filter(timestamps__date__gte=start_of_month)
            .values("food_type")
            .annotate(order_count=Count("food_type"))
        )
    combined = {}
    for item in order_data:
        ft = item["food_type"]
        combined[ft] = combined.get(ft, 0) + item["order_count"]
    most_placed = "No orders this month"
    if combined:
        top = max(combined, key=combined.get)
        most_placed = f"{top} ({combined[top]} orders)"
    daily_revenue = CompletedOrder.objects.filter(timestamps__date=today).aggregate(t=Sum("price"))["t"] or 0
    weekly_revenue = CompletedOrder.objects.filter(timestamps__date__gte=today - timedelta(days=7)).aggregate(t=Sum("price"))["t"] or 0
    monthly_revenue = CompletedOrder.objects.filter(timestamps__year=today.year, timestamps__month=today.month).aggregate(t=Sum("price"))["t"] or 0
    yearly_revenue = CompletedOrder.objects.filter(timestamps__year=today.year).aggregate(t=Sum("price"))["t"] or 0
    unread = {}
    for name, m in [
        ("Soda", Soda), ("Water", Water), ("Juices", Juices), ("Energydrinks", Energydrink),
        ("Wines", Wines), ("Beers", Beers), ("Whiskeys", Whiskeys),
        ("Breakfast", Breakfast), ("Lunch", Lunch), ("Supper", Supper),
        ("Burgers", Burgers), ("Taccos", Taccos), ("Pizza", Pizza), ("Sand_Wich", Sand_Wich), ("Chips", Chips),
    ]:
        unread[name] = m.objects.filter(is_read=False).count()
    return Response({
        "daily_orders": daily_orders,
        "weekly_orders": weekly_orders,
        "monthly_orders": monthly_orders,
        "most_placed_order": most_placed,
        "daily_revenue": float(daily_revenue),
        "weekly_revenue": float(weekly_revenue),
        "monthly_revenue": float(monthly_revenue),
        "yearly_revenue": float(yearly_revenue),
        "unread_notifications_count_by_category": unread,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_chart_data(request):
    today = now().date()
    start_of_month = today.replace(day=1)
    # Last day of current month
    next_month = start_of_month.replace(day=28) + timedelta(days=4)
    end_of_month = next_month.replace(day=1) - timedelta(days=1)
    from collections import defaultdict
    models_list = [
        Breakfast, Lunch, Supper, Water, Soda, Energydrink, Juices,
        Beers, Wines, Whiskeys, Burgers, Taccos, Pizza, Sand_Wich, Chips,
    ]
    daily_orders = defaultdict(int)
    category_totals = defaultdict(int)
    weekly_orders = [0, 0, 0, 0]
    for m in models_list:
        orders = m.objects.filter(timestamps__date__gte=start_of_month, timestamps__date__lte=end_of_month)
        for o in orders:
            daily_orders[o.timestamps.date().weekday()] += 1
            category_totals[m.__name__] += 1
            wn = (o.timestamps.date() - start_of_month).days // 7
            if 0 <= wn < 4:
                weekly_orders[wn] += 1
    daily_totals = [daily_orders.get(i, 0) for i in range(7)]
    pie_data = [{"category": k, "total": v} for k, v in category_totals.items()]
    return Response({
        "daily_orders": daily_totals,
        "pie_chart_data": pie_data,
        "weekly_orders": weekly_orders,
    })


# ----- Admin: order lists (by category) -----
def _orders_list(request, model, serializer_fields):
    model.objects.filter(is_read=False).update(is_read=True)
    qs = model.objects.all().order_by("-timestamps")
    data = list(qs.values(*serializer_fields))
    for d in data:
        for k, v in d.items():
            if hasattr(v, "isoformat"):
                d[k] = v.isoformat()
            elif hasattr(v, "__float__") and not isinstance(v, (int, bool)):
                d[k] = float(v)
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_breakfast(request):
    return _orders_list(request, Breakfast, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_lunch(request):
    return _orders_list(request, Lunch, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_supper(request):
    return _orders_list(request, Supper, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_water(request):
    return _orders_list(request, Water, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_juices(request):
    return _orders_list(request, Juices, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_soda(request):
    return _orders_list(request, Soda, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_energydrink(request):
    return _orders_list(request, Energydrink, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_beers(request):
    return _orders_list(request, Beers, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_wines(request):
    return _orders_list(request, Wines, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_whiskeys(request):
    return _orders_list(request, Whiskeys, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_burgers(request):
    return _orders_list(request, Burgers, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_taccos(request):
    return _orders_list(request, Taccos, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_pizza(request):
    return _orders_list(request, Pizza, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_sand_wich(request):
    return _orders_list(request, Sand_Wich, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders_chips(request):
    return _orders_list(request, Chips, ["id", "table_number", "food_type", "number_of_people", "unit_price", "total_price", "timestamps", "is_read"])


# ----- Admin: CRUD menu items -----
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def api_food_items_admin(request):
    if request.method == "GET":
        items = FoodItem.objects.all().order_by("category", "name")
        return Response(FoodItemSerializer(items, many=True).data)
    ser = FoodItemSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def api_food_item_detail(request, pk):
    item = FoodItem.objects.filter(pk=pk).first()
    if not item:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(FoodItemSerializer(item).data)

    if request.method in ["PUT", "PATCH"]:
        ser = FoodItemSerializer(item, data=request.data, partial=(request.method == "PATCH"))
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        ser.save()
        return Response(ser.data)

    # DELETE
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def api_drinks_items_admin(request):
    if request.method == "GET":
        items = DrinksItem.objects.all().order_by("category", "name")
        return Response(DrinksItemSerializer(items, many=True).data)
    ser = DrinksItemSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def api_drinks_item_detail(request, pk):
    item = DrinksItem.objects.filter(pk=pk).first()
    if not item:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(DrinksItemSerializer(item).data)

    if request.method in ["PUT", "PATCH"]:
        ser = DrinksItemSerializer(item, data=request.data, partial=(request.method == "PATCH"))
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        ser.save()
        return Response(ser.data)

    # DELETE
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def api_alcohol_items_admin(request):
    if request.method == "GET":
        items = alcoholicDrinksItem.objects.all().order_by("category", "name")
        return Response(AlcoholItemSerializer(items, many=True).data)
    ser = AlcoholItemSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def api_alcohol_item_detail(request, pk):
    item = alcoholicDrinksItem.objects.filter(pk=pk).first()
    if not item:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(AlcoholItemSerializer(item).data)

    if request.method in ["PUT", "PATCH"]:
        ser = AlcoholItemSerializer(item, data=request.data, partial=(request.method == "PATCH"))
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        ser.save()
        return Response(ser.data)

    # DELETE
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def api_fast_food_items_admin(request):
    if request.method == "GET":
        items = edit_fast_foodsItem.objects.all().order_by("category", "name")
        return Response(FastFoodItemSerializer(items, many=True).data)
    ser = FastFoodItemSerializer(data=request.data)
    if not ser.is_valid():
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def api_fast_food_item_detail(request, pk):
    item = edit_fast_foodsItem.objects.filter(pk=pk).first()
    if not item:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(FastFoodItemSerializer(item).data)

    if request.method in ["PUT", "PATCH"]:
        ser = FastFoodItemSerializer(item, data=request.data, partial=(request.method == "PATCH"))
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        ser.save()
        return Response(ser.data)

    # DELETE
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
