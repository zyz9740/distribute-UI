from django.db import models


class Content(models.Model):
    id = models.AutoField(primary_key=True)
    UI_element = models.CharField(max_length=200)
