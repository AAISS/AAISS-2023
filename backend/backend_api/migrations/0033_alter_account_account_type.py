# Generated by Django 4.2.4 on 2023-11-09 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0032_committee_staff_misc_year_payment_date_payment_year_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='account_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'admin'), (1, 'User')], default=1),
        ),
    ]