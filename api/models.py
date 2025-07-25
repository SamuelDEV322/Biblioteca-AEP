from django.db import models
from django.contrib.auth.models import User

class Autor(models.Model):
    nombre = models.CharField(max_length=100)
    def __str__(self):
        return self.nombre

class Editorial(models.Model):
    nombre = models.CharField(max_length=100)
    def __str__(self):
        return self.nombre

class Genero(models.Model):
    nombre = models.CharField(max_length=100)
    def __str__(self):
        return self.nombre

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    editorial = models.CharField(max_length=100)
    genero = models.CharField(max_length=100)
    fecha_publicacion = models.DateField(null=True, blank=True)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo

class Prestamo(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_prestamo = models.DateField(auto_now_add=True)
    fecha_devolucion = models.DateField(null=True, blank=True)
    devuelto = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.devuelto:
            self.libro.disponible = True
        else:
            self.libro.disponible = False
        self.libro.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.usuario.username} - {self.libro.titulo}"
