from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ApplicantTrackingSystemViewSet, ApplicationStageMappingViewSet, autoMatch

router = DefaultRouter()
router.register(r'atss', ApplicantTrackingSystemViewSet)
router.register(r'stage-mapping', ApplicationStageMappingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('grok/automatch/', autoMatch)
]