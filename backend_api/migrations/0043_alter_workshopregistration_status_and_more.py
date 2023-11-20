# Generated by Django 4.2.4 on 2023-11-20 08:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("backend_api", "0042_workshop_registration_model"),
    ]

    operations = [
        migrations.AlterField(
            model_name="workshopregistration",
            name="status",
            field=models.IntegerField(
                choices=[(1, "Waiting for payment"), (2, "Purchase confirmed")],
                default=1,
            ),
        ),
        migrations.CreateModel(
            name="PresentationParticipation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.IntegerField(
                        choices=[(1, "Waiting for payment"), (2, "Purchase confirmed")],
                        default=1,
                    ),
                ),
                (
                    "presentation",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="backend_api.presentation",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="backend_api.user",
                    ),
                ),
            ],
            options={
                "unique_together": {("presentation", "user")},
            },
        ),
        migrations.AddField(
            model_name="user",
            name="participated_presentations",
            field=models.ManyToManyField(
                blank=True,
                through="backend_api.PresentationParticipation",
                to="backend_api.presentation",
            ),
        ),
        migrations.AddField(
            model_name='payment',
            name='presentations',
            field=models.ManyToManyField(blank=True, to='backend_api.presentation'),
        ),
        migrations.AddField(
            model_name='presentation',
            name='cost',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
