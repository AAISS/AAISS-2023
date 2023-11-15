import datetime
from urllib.parse import urljoin

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from aaiss_backend import settings
from aaiss_backend.settings import BASE_URL
from backend_api import validators
from backend_api.email import MailerThread
from utils.random import create_random_string

SMALL_MAX_LENGTH = 255
BIG_MAX_LENGTH = 65535


class AccountManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """Creates User Accounts to use in user model"""
        extra_fields.setdefault('account_type', 1)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Creates default superusers"""
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class FieldOfInterest(models.Model):
    """Field of interest which user can add to their profile"""
    name = models.CharField(max_length=SMALL_MAX_LENGTH)

    def __str__(self):
        return f"FOI with name: {self.name}"


class Teacher(models.Model):
    """Workshop teacher database model"""
    name = models.CharField(max_length=SMALL_MAX_LENGTH)
    pic = models.ImageField(blank=True)
    cv_path = models.CharField(max_length=511, blank=True, default="")
    bio = models.CharField(max_length=BIG_MAX_LENGTH)
    order = models.SmallIntegerField(default=0)
    year = models.IntegerField(blank=False, default=2020)

    def __str__(self):
        return f"Teacher with id {self.id}: {self.name}"


class Presenter(models.Model):
    """Presentation presenter database model"""
    name = models.CharField(max_length=SMALL_MAX_LENGTH)
    pic = models.ImageField(blank=True)
    workplace = models.CharField(max_length=SMALL_MAX_LENGTH, blank=True)
    paper = models.CharField(max_length=SMALL_MAX_LENGTH, blank=True)
    cv_path = models.CharField(max_length=511, blank=True, default="")
    bio = models.CharField(max_length=BIG_MAX_LENGTH)
    order = models.SmallIntegerField(default=0)
    year = models.IntegerField(blank=False, default=2020)

    def __str__(self):
        return f"Presenter with id {self.id}: {self.name}==> {self.year}"


class Workshop(models.Model):
    name = models.CharField(max_length=SMALL_MAX_LENGTH)
    teachers = models.ManyToManyField(Teacher)
    cost = models.PositiveIntegerField()
    desc = models.CharField(max_length=BIG_MAX_LENGTH)
    has_project = models.BooleanField(default=False, blank=False)
    prerequisites = models.CharField(max_length=BIG_MAX_LENGTH, default='', blank=True)
    capacity = models.PositiveSmallIntegerField(default=50)
    add_to_calendar_link = models.CharField(max_length=SMALL_MAX_LENGTH, default='', blank=True)
    year = models.IntegerField(blank=False, default=2020)

    NOT_ASSIGNED = 'NOT_ASSIGNED'
    ELEMENTARY = 'Elementary'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'
    options = [
        (NOT_ASSIGNED, _('NOT_ASSIGNED')),
        (ELEMENTARY, _('Elementary')),
        (INTERMEDIATE, _('Intermediate')),
        (ADVANCED, _('Advanced')),
    ]
    level = models.CharField(
        choices=options,
        default=NOT_ASSIGNED,
        blank=True,
        max_length=15
    )

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def no_of_participants(self):
        return len(User.objects.filter(registered_workshops=self).all())

    @property
    def participants(self):
        users = []
        for user in User.objects.filter(registered_workshops=self).all():
            users.append(user)
        return users

    def __str__(self):
        name = ""
        for teacher in self.teachers.all():
            name += teacher.name + " "
        return f"{name}: {self.name}"


class Presentation(models.Model):
    name = models.CharField(max_length=SMALL_MAX_LENGTH)
    presenters = models.ManyToManyField(Presenter)
    desc = models.CharField(max_length=BIG_MAX_LENGTH)
    year = models.IntegerField(blank=False, default=2020)

    NOT_ASSIGNED = 'NOT_ASSIGNED'
    ELEMENTARY = 'Elementary'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'
    options = [
        (NOT_ASSIGNED, _('NOT_ASSIGNED')),
        (ELEMENTARY, _('Elementary')),
        (INTERMEDIATE, _('Intermediate')),
        (ADVANCED, _('Advanced')),
    ]
    level = models.CharField(
        choices=options,
        default=NOT_ASSIGNED,
        blank=True,
        max_length=15
    )

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def no_of_participants(self):
        return len(User.objects.filter(registered_for_presentations=True).all())

    @property
    def participants(self):
        users = []
        for user in User.objects.filter(registered_for_presentations=True).all():
            users.append(user)
        return users

    def __str__(self):
        name = ""
        for presenter in self.presenters.all():
            name += presenter.name + " "
        print(name)
        return f"{name}: {self.name}"


class Account(AbstractBaseUser, PermissionsMixin):
    """Default user model for database"""
    ACCOUNT_TYPE_CHOICES = (
        (0, 'admin'),
        (1, 'User')
    )
    _ACTIVATION_CODE_LENGTH = 32
    account_type = models.PositiveSmallIntegerField(choices=ACCOUNT_TYPE_CHOICES, default=1)
    email = models.EmailField(max_length=SMALL_MAX_LENGTH, unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    activation_code = models.CharField(max_length=SMALL_MAX_LENGTH, blank=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return f"User with id {self.id}: {self.email}"

    def send_registration_email(self):
        self.activation_code = create_random_string(self._ACTIVATION_CODE_LENGTH)
        self.save()
        registration_url = urljoin(BASE_URL, reverse('activate') + "?" + f"token={self.activation_code}")
        MailerThread("AAISS registration email", [self.email],
                     render_to_string('registration_email.html',
                                      {'registration_url': registration_url})).start()


class User(models.Model):
    """Generic non-admin user profile data"""
    account = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=SMALL_MAX_LENGTH)
    fields_of_interest = models.ManyToManyField(FieldOfInterest, blank=True)
    registered_workshops = models.ManyToManyField(Workshop, blank=True)
    registered_for_presentations = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=12, validators=[validators.validate_all_number])

    def __str__(self):
        return f"{self.account}"


class Misc(models.Model):
    name = models.CharField(max_length=SMALL_MAX_LENGTH, primary_key=True)
    desc = models.CharField(max_length=BIG_MAX_LENGTH, blank=True)
    pic = models.ImageField(blank=True)
    year = models.IntegerField(blank=False, default=2020)

    def __str__(self):
        return f"Misc with name {self.name}"


class Mailer(models.Model):
    ALL = 1
    WORKSHOP = 2
    PRESENTATIONS = 3
    CUSTOM = 4
    options = [
        (WORKSHOP, _('Send email to selected workshop(s) registered users')),
        (PRESENTATIONS, _('Send email to presentations users')),
        (ALL, _('Send email to all users')),
        (CUSTOM, _('Send email to custom selection of users')),
    ]

    subject = models.CharField(max_length=SMALL_MAX_LENGTH)
    target_mode = models.PositiveSmallIntegerField(
        choices=options,
        default=ALL,
    )
    workshop_selection = models.ManyToManyField(Workshop, blank=True)
    user_selection = models.ManyToManyField(User, blank=True)
    HTML_body = models.CharField(max_length=BIG_MAX_LENGTH)

    def __str__(self):
        return f"Mailer with id {self.id}: subject= {self.subject}"


class Payment(models.Model):
    authority = models.CharField(max_length=SMALL_MAX_LENGTH, primary_key=True)
    total_price = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workshops = models.ManyToManyField(Workshop, blank=True)
    presentation = models.BooleanField(default=False, blank=True)
    is_done = models.BooleanField(default=False)
    ref_id = models.CharField(default='', max_length=SMALL_MAX_LENGTH)
    year = models.IntegerField(blank=False, default=2020)
    date = models.DateField(blank=False,
                            default=datetime.datetime(year=2020, month=7, day=1, hour=0, minute=0, second=0,
                                                      microsecond=0))

    def __str__(self):
        return f"Payment for {self.user.account} ({self.total_price})  in {str(self.date)}"


class Committee(models.Model):
    profile = models.ImageField(verbose_name='profile', null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    year = models.IntegerField(blank=False, default=2020)

    def __str__(self):
        return self.first_name + ' ' + self.last_name + ' ' + str(self.description)


IDPAY_STATUS = [
    (1, 'payment_not_made'),
    (2, 'payment_failed'),
    (3, 'error'),
    (4, 'blocked'),
    (5, 'return_to_payer'),
    (6, 'system_reversal'),
    (7, 'cancel_payment'),
    (8, 'moved_to_payment_gateway'),
    (10, 'awaiting_payment_verification'),
    (100, 'payment_is_approved'),
    (101, 'payment_is_approved'),
    (200, 'was_deposited'),
    (201, 'payment_created'),
    (405, "error")

]


class NewPayment(models.Model):
    total_price = models.PositiveIntegerField()
    status = models.IntegerField(choices=IDPAY_STATUS, default=201)
    payment_id = models.CharField(null=True, max_length=42)
    payment_link = models.TextField(null=True)
    card_number = models.CharField(null=True, max_length=16)
    hashed_card_number = models.TextField(null=True)
    payment_trackID = models.CharField(null=True, max_length=20)
    verify_trackID = models.CharField(null=True, max_length=20)
    created_date = models.DateTimeField(null=True)
    finished_date = models.DateTimeField(null=True)
    verified_date = models.DateTimeField(null=True)
    original_data = models.TextField(null=True)
    workshops = models.ManyToManyField(Workshop, blank=True)
    presentation = models.BooleanField(default=False, blank=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='payments', )

    def payment_state(self):
        return self.get_status_display()

    def __str__(self):
        return f"{self.pk}"



ROLE = [
    ("Team Lead", "TL"),
    ("Member", "MB")
]

SECTIONS = [
    ("Executive", "EXC"),
    ("Scientific", "SCI"),
    ("Technical", "TCH"),
    ("Graphic", "GRP"),
    ("Marketing", "MRK")
]

class Staff(models.Model):
    name = models.CharField(max_length=100, null=False, default="Human")
    role = models.CharField(max_length=100, null=False, default="Executive", choices=ROLE)
    image = models.ImageField(blank=True)  
    section_name = models.CharField(max_length=100, null=False, default="Member", choices=SECTIONS)
    def __str__(self):

        return self.name
