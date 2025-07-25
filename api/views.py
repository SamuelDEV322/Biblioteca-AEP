from rest_framework import viewsets, filters 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Libro, Autor, Editorial, Genero, Prestamo
from .serializers import LibroSerializer, AutorSerializer, EditorialSerializer, GeneroSerializer, PrestamoSerializer
from .permissions import IsAdmin
from django.db.models import Count

# VISTA PARA LIBROS
class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()  # Lista completa de libros
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'autor__nombre', 'editorial__nombre', 'genero__nombre']
    ordering_fields = ['anio_publicacion', 'titulo']

    # Permite ver libros si estás autenticado pero solo los admins pueden modificar
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

# VISTAS PARA AUTOR, EDITORIAL Y GÉNERO SON SIMILARES:
class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

class EditorialViewSet(viewsets.ModelViewSet):
    queryset = Editorial.objects.all()
    serializer_class = EditorialSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

class GeneroViewSet(viewsets.ModelViewSet):
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

#  VISTA CORREGIDA PARA PRÉSTAMOS
class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()  # IMPORTANTE para que el router DRF funcione correctamente
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['fecha_prestamo', 'fecha_devolucion']
    search_fields = ['libro__titulo']

    # Solo los administradores ven todos los préstamos, otros solo los suyos
    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Administrador').exists():
            return Prestamo.objects.all()
        return Prestamo.objects.filter(usuario=user)

    # Al crear un préstamo, lo guarda tal como se recibe
    def perform_create(self, serializer):
        serializer.save()


class LibrosMasPrestadosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Se agrupan los préstamos por libro y se cuenta cuántas veces se ha prestado cada uno
        libros_con_cantidad = (
            Prestamo.objects.values('libro')
            .annotate(total=Count('libro'))
            .order_by('-total')[:10]  # Puedes cambiar el número de resultados
        )

        # Extraemos los IDs de los libros más prestados
        ids_libros = [item['libro'] for item in libros_con_cantidad]

        # Obtenemos los libros ordenados manualmente por cantidad de préstamos
        libros = Libro.objects.filter(id__in=ids_libros)
        libros_dict = {libro.id: libro for libro in libros}

        # Reconstruimos los datos en orden
        resultados = [
            {
                'libro': LibroSerializer(libros_dict[item['libro']]).data,
                'veces_prestado': item['total']
            }
            for item in libros_con_cantidad
            if item['libro'] in libros_dict
        ]

        return Response(resultados)
    

class DisponibilidadLibrosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = Libro.objects.count()
        disponibles = Libro.objects.filter(disponible=True).count()
        prestados = total - disponibles

        return Response({
            "total_libros": total,
            "disponibles": disponibles,
            "prestados": prestados
        })


class HistorialPrestamosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Agrupamos por fecha de préstamo y contamos cuántos hay por fecha
        historial = (
            Prestamo.objects
            .values('fecha_prestamo')
            .annotate(cantidad=Count('id'))
            .order_by('fecha_prestamo')
        )

        # Convertimos los datos a una lista de objetos simples
        data = [
            {"fecha": item['fecha_prestamo'], "cantidad": item['cantidad']}
            for item in historial
        ]

        return Response(data)
