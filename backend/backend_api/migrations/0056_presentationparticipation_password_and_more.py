# Generated by Django 4.2.4 on 2023-12-05 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0055_alter_discount_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='presentationparticipation',
            name='password',
            field=models.CharField(default='KlWfmELW5ixsZmqh', max_length=255),
        ),
        migrations.AddField(
            model_name='workshopregistration',
            name='password',
            field=models.CharField(default='g0WmA7rXbIxm5OVJ', max_length=255),
        ),
        migrations.AlterField(
            model_name='discount',
            name='code',
            field=models.CharField(default='4Hjyva31c9rSMamSNQkqWz1lrMa0kr1E', max_length=32, unique=True),
        ),
    ]
