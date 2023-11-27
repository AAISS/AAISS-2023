from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from backend_api import views


class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super(DefaultRouter, self).__init__(*args, **kwargs)
        self.trailing_slash = '/?'


router = OptionalSlashRouter()
router.register('foi', views.FieldOfInterestViewSet, basename='field_of_interest')

staff_routes = [
    path(r'<int:year>/staff/', views.StaffViewSet.as_view({"get": "list"})),
]

committee_routes = [
    path(r'<int:year>/committee/', views.CommitteeViewSet.as_view({'get': 'list'})),
]

teacher_routes = [
    path(r'<int:year>/teacher/', views.TeacherViewSet.as_view({'get': 'list'})),
    path(r'<int:year>/teacher/<pk>/', views.TeacherViewSet.as_view({'get': 'retrieve'})),
]

presenter_route = [
    path(r'<int:year>/presenter/', views.PresenterViewSet.as_view({'get': 'list'})),
    path(r'<int:year>/presenter/<pk>/', views.PresenterViewSet.as_view({'get': 'retrieve'})),
]

presentation_route = [
    path(r'<int:year>/presentation/', views.PresentationViewSet.as_view({'get': 'list'})),
    path(r'<int:year>/presentation/<pk>/', views.PresentationViewSet.as_view({'get': 'retrieve'})),
]

workshop_route = [
    path(r'<int:year>/workshop/', views.WorkshopViewSet.as_view({'get': 'list'})),
    path(r'<int:year>/workshop/<pk>/', views.WorkshopViewSet.as_view({'get': 'retrieve'})),
]

misc_route = [
    path(r'<int:year>/misc/', views.MiscViewSet.as_view({'get': 'list'})),
    path(r'<int:year>/misc/<pk>/', views.MiscViewSet.as_view({'get': 'retrieve'})),
]

user_route = [
    path('user/', views.UserViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path(r'user/<int:pk>/', views.UserViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('user/activate/', views.UserViewSet.as_view({
        'get': 'activate'
    }), name='activate'),
    path('user/workshop/', views.WorkshopRegistrationViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('user/workshop/<int:pk>/', views.WorkshopRegistrationViewSet.as_view({
        'delete': 'destroy',
    })),
    path('user/presentation/', views.PresentationRegistrationViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('user/presentation/<int:pk>/', views.PresentationRegistrationViewSet.as_view({
        'delete': 'destroy',
    }))
]

urlpatterns = [
    # routes for obtaining/refreshing jwt token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('', include(teacher_routes)),
    path('', include(presenter_route)),
    path('', include(presentation_route)),
    path('', include(workshop_route)),
    path('', include(misc_route)),
    path('', include(staff_routes)),
    path('', include(committee_routes)),
    path('', include(user_route)),
    path('payment/', views.PaymentViewSet.as_view({'post': 'payment'})),
    path('payment/verify/', views.PaymentViewSet.as_view({'post': 'verify'})),
]
