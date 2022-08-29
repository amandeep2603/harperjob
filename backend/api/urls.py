from django.urls import path
from .views import *

urlpatterns=[
    path('',index,name="index"),
    path('hr/signup/', signuphr , name="signup hr"),
    path('hr/login/', loginhr , name="login hr"),
    path('hr/filterdev/', filterdev, name="filter developers"),
    path('hr/pindev/', pindev, name="pin developers"),
    path('hr/searchpindev/', searchpinddev, name="search pin developers")
]