from django.db import models


class Content(models.Model):
    id = models.AutoField(primary_key=True)
    subtree = models.CharField(max_length=10000)
    css = models.CharField(max_length=10000)
