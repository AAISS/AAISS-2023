# Generated by Django 4.2.4 on 2023-11-15 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend_api", "0034_account_activation_code_alter_account_is_active"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="staff",
            name="entrance",
        ),
        migrations.RemoveField(
            model_name="staff",
            name="first_name",
        ),
        migrations.RemoveField(
            model_name="staff",
            name="last_name",
        ),
        migrations.RemoveField(
            model_name="staff",
            name="profile",
        ),
        migrations.RemoveField(
            model_name="staff",
            name="year",
        ),
        migrations.AddField(
            model_name="staff",
            name="image",
            field=models.ImageField(blank=True, upload_to=""),
        ),
        migrations.AddField(
            model_name="staff",
            name="name",
            field=models.CharField(default="Human", max_length=100),
        ),
        migrations.AddField(
            model_name="staff",
            name="role",
            field=models.CharField(default="Staff", max_length=100),
        ),
        migrations.CreateModel(
            name="StaffSection",
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
                ("section_name", models.CharField(default="Staff", max_length=100)),
                ("staff", models.ManyToManyField(to="backend_api.staff")),
            ],
        ),
    ]
