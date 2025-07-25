from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet, AutorViewSet, EditorialViewSet, GeneroViewSet, PrestamoViewSet, LibrosMasPrestadosAPIView, DisponibilidadLibrosAPIView,HistorialPrestamosAPIView
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'libros', LibroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'editoriales', EditorialViewSet)
router.register(r'generos', GeneroViewSet)
router.register(r'prestamos', PrestamoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token),

    path('reportes/mas-prestados/', LibrosMasPrestadosAPIView.as_view(), name='mas-prestados'),
    path('reportes/disponibilidad/', DisponibilidadLibrosAPIView.as_view(), name='disponibilidad'),
    path('reportes/historial/', HistorialPrestamosAPIView.as_view(), name='historial'),
]
