# Generated by Django 4.2.4 on 2023-11-15 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend_api", "0039_alter_staff_role_alter_staffsection_section_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="staff",
            name="section_name",
            field=models.CharField(
                choices=[
                    ("Executive", "EXC"),
                    ("Scientific", "SCI"),
                    ("Technical", "TCH"),
                    ("Graphic", "GRP"),
                    ("Marketing", "MRK"),
                ],
                default="Member",
                max_length=100,
            ),
        ),
        migrations.DeleteModel(
            name="StaffSection",
        ),
    ]