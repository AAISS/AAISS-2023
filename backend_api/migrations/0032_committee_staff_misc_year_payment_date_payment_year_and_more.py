# Generated by Django 4.2.4 on 2023-08-03 12:00

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0031_workshop_add_to_calendar_link'),
    ]

    operations = [
        migrations.CreateModel(
            name='Committee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile', models.ImageField(blank=True, null=True, upload_to='', verbose_name='profile')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=50)),
                ('year', models.IntegerField(default=2020)),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile', models.ImageField(blank=True, null=True, upload_to='', verbose_name='profile')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('year', models.IntegerField(default=2020)),
                ('entrance', models.IntegerField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='misc',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='payment',
            name='date',
            field=models.DateField(default=datetime.datetime(2020, 7, 1, 0, 0)),
        ),
        migrations.AddField(
            model_name='payment',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='presentation',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='presenter',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='teacher',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='workshop',
            name='year',
            field=models.IntegerField(default=2020),
        ),
        migrations.AlterField(
            model_name='account',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='fieldofinterest',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='mailer',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='presentation',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='presenter',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='workshop',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.CreateModel(
            name='NewPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.PositiveIntegerField()),
                ('status', models.IntegerField(choices=[(1, 'payment_not_made'), (2, 'payment_failed'), (3, 'error'), (4, 'blocked'), (5, 'return_to_payer'), (6, 'system_reversal'), (7, 'cancel_payment'), (8, 'moved_to_payment_gateway'), (10, 'awaiting_payment_verification'), (100, 'payment_is_approved'), (101, 'payment_is_approved'), (200, 'was_deposited'), (201, 'payment_created'), (405, 'error')], default=201)),
                ('payment_id', models.CharField(max_length=42, null=True)),
                ('payment_link', models.TextField(null=True)),
                ('card_number', models.CharField(max_length=16, null=True)),
                ('hashed_card_number', models.TextField(null=True)),
                ('payment_trackID', models.CharField(max_length=20, null=True)),
                ('verify_trackID', models.CharField(max_length=20, null=True)),
                ('created_date', models.DateTimeField(null=True)),
                ('finished_date', models.DateTimeField(null=True)),
                ('verified_date', models.DateTimeField(null=True)),
                ('original_data', models.TextField(null=True)),
                ('presentation', models.BooleanField(blank=True, default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='backend_api.user')),
                ('workshops', models.ManyToManyField(blank=True, to='backend_api.workshop')),
            ],
        ),
    ]
