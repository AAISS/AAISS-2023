import datetime
import uuid
from urllib.parse import urljoin

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.utils.html import escape

from aaiss_backend import settings
from aaiss_backend.settings import BASE_URL
from backend_api import validators
from backend_api.email import MailerThread
from utils.random import create_random_string
from utils.renderers import new_detailed_response
from urllib.parse import quote

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
        extra_fields.setdefault('is_staff', True)

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
    workplace_logo = models.ImageField(blank=True)
    workplace = models.CharField(max_length=SMALL_MAX_LENGTH, blank=True)
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
    workplace_logo = models.ImageField(blank=True)
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

    @property
    def no_of_participants(self) -> int:
        return len(
            WorkshopRegistration.objects.filter(workshop=self,
                                                status=WorkshopRegistration.StatusChoices.PURCHASED))

    @property
    def remaining_capacity(self) -> int:
        return max(self.capacity - self.no_of_participants, 0)

    @property
    def participants(self):
        participants = []
        for participant in WorkshopRegistration.objects.filter(workshop=self,
                                                               status=
                                                               WorkshopRegistration.StatusChoices.PURCHASED):
            participants.append(participant.user)
        return participants

    @property
    def google_calendar_link(self):
        base_url = "https://www.google.com/calendar/render?action=TEMPLATE"
        workshop_title = escape(self.name)
        workshop_description = escape(self.desc)
        start_datetime = self.start_date.strftime("%Y%m%dT%H%M%S")
        end_datetime = self.end_date.strftime("%Y%m%dT%H%M%S")

        teachers_names = " ".join([teacher.name for teacher in self.teachers.all()])
        event_details = f"Teachers: {teachers_names}\nDescription: {workshop_description}"
        query_params = f"text={quote(workshop_title)}&dates={start_datetime}/{end_datetime}&details={quote(event_details)}"

        link = f"{base_url}&{query_params}"

        return link

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
    cost = models.PositiveIntegerField(default=0)
    capacity = models.PositiveIntegerField(default=50)
    has_project = models.BooleanField(default=False, blank=False)

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

    @property
    def no_of_participants(self) -> int:
        return len(
            PresentationParticipation.objects.filter(presentation=self,
                                                     status=PresentationParticipation.StatusChoices.PURCHASED))

    @property
    def remaining_capacity(self) -> int:
        return max(self.capacity - self.no_of_participants, 0)

    @property
    def participants(self):
        participants = []
        for participant in PresentationParticipation.objects.filter(presentation=self,
                                                                    status=
                                                                    PresentationParticipation.StatusChoices.PURCHASED):
            participants.append(participant.user)
        return participants

    @property
    def google_calendar_link(self):
        base_url = "https://www.google.com/calendar/render?action=TEMPLATE"
        presentation_title = escape(self.name)
        presentation_description = escape(self.desc)
        start_datetime = self.start_date.strftime("%Y%m%dT%H%M%S")
        end_datetime = self.end_date.strftime("%Y%m%dT%H%M%S")

        presenters_names = " ".join([presenter.name for presenter in self.presenters.all()])
        event_details = f"Presenters: {presenters_names}\nDescription: {presentation_description}"
        query_params = f"text={quote(presentation_title)}&dates={start_datetime}/{end_datetime}&details={quote(event_details)}"

        link = f"{base_url}&{query_params}"

        return link

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
    registered_workshops = models.ManyToManyField(Workshop, blank=True, through='WorkshopRegistration')
    participated_presentations = models.ManyToManyField(Presentation, blank=True, through='PresentationParticipation')
    registered_for_presentations = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=12, validators=[validators.validate_all_number])

    def __str__(self):
        return f"{self.account}"


class WorkshopRegistration(models.Model):
    class StatusChoices(models.IntegerChoices):
        AWAITING_PAYMENT = 1, _('Waiting for payment')
        PURCHASED = 2, _('Purchase confirmed')

    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField(choices=StatusChoices.choices, default=StatusChoices.AWAITING_PAYMENT)

    class Meta:
        unique_together = ('workshop', 'user',)


class PresentationParticipation(models.Model):
    class StatusChoices(models.IntegerChoices):
        AWAITING_PAYMENT = 1, _('Waiting for payment')
        PURCHASED = 2, _('Purchase confirmed')

    presentation = models.ForeignKey(Presentation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField(choices=StatusChoices.choices, default=StatusChoices.AWAITING_PAYMENT)

    class Meta:
        unique_together = ('presentation', 'user',)


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


class Discount(models.Model):
    _CODE_LENGTH = 8
    code = models.CharField(max_length=_CODE_LENGTH, null=False, default=create_random_string(_CODE_LENGTH),
                            unique=True)
    discount_percent = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    capacity = models.IntegerField(default=0)
    expiration_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.code

    @property
    def participants(self):
        users = []
        for payment in self.payment_set.filter(status=Payment.PaymentStatus.PAYMENT_CONFIRMED):
            users.append(payment.user)
        return users

    @property
    def remaining_capacity(self) -> int:
        return self.capacity - self.payment_set.filter(status=Payment.PaymentStatus.PAYMENT_CONFIRMED).count()

    def is_usable(self, user: User) -> bool:
        if not self.is_active:
            raise ValidationError(new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                                        "Discount is not active"))
        if self.remaining_capacity <= 0:
            raise ValidationError(new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                                        "Discount capacity is full"))
        if self.expiration_date < timezone.now():
            raise ValidationError(new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                                        "Discount has expired"))
        if self.payment_set.filter(user=user, status=Payment.PaymentStatus.PAYMENT_CONFIRMED).exists():
            raise ValidationError(new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                                        "Discount has already been used by this user"))
        return True


class Payment(models.Model):
    class PaymentStatus(models.IntegerChoices):
        AWAITING_PAYMENT = 0, _('Awaiting payment')
        PAYMENT_CONFIRMED = 1, _('Payment confirmed')
        PAYMENT_REJECTED = 2, _('Payment rejected')

    _DISCOUNT_THRESHOLD = 200000  # in Tomans
    _DISCOUNT_PERCENTAGE = 25  # in percent

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    amount = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workshops = models.ManyToManyField(Workshop, blank=True)
    presentations = models.ManyToManyField(Presentation, blank=True)
    status = models.IntegerField(default=PaymentStatus.AWAITING_PAYMENT, choices=PaymentStatus.choices)
    year = models.IntegerField(blank=False, default=2020)
    date = models.DateField(blank=False,
                            default=datetime.datetime(year=2020, month=7, day=1, hour=0, minute=0, second=0,
                                                      microsecond=0))
    track_id = models.CharField(max_length=20, null=True, default=None)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return f"Payment for {self.user.account} ({self.amount})  in {str(self.date)}"

    def update_payment_status(self, payment_status: PaymentStatus):
        self.status = payment_status
        if payment_status == self.PaymentStatus.PAYMENT_CONFIRMED:
            for workshop in self.workshops.all():
                try:
                    workshop = WorkshopRegistration.objects.get(user=self.user, workshop=workshop)
                    workshop.status = WorkshopRegistration.StatusChoices.PURCHASED
                    workshop.save()
                except ObjectDoesNotExist:
                    pass
            for presentation in self.presentations.all():
                try:
                    presentation = PresentationParticipation.objects.get(user=self.user, presentation=presentation)
                    presentation.status = PresentationParticipation.StatusChoices.PURCHASED
                    presentation.save()
                except ObjectDoesNotExist:
                    pass
        self.save()

    @staticmethod
    def create_payment_for_user(user: User, discount: Discount):
        total_cost = 0
        workshops: list[Workshop] = []
        presentations: list[Presentation] = []
        for workshop in user.registered_workshops.all():
            try:
                workshop_registration = workshop.workshopregistration_set.get(workshop_id=workshop.id, user=user)
                if workshop_registration.status != WorkshopRegistration.StatusChoices.AWAITING_PAYMENT:
                    continue
                if workshop.remaining_capacity <= 0:
                    raise ValidationError(
                        new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                              f"Workshop {workshop.id} is full"))
                total_cost += workshop.cost
                workshops.append(workshop)
            except ObjectDoesNotExist:
                raise ValueError(f"User {user} is registered for workshop {workshop} but has no registration")
        for presentation in user.participated_presentations.all():
            try:
                presentation_participation = presentation.presentationparticipation_set.get(
                    presentation_id=presentation.id, user=user)
                if presentation_participation.status != PresentationParticipation.StatusChoices.AWAITING_PAYMENT:
                    continue
                if presentation.remaining_capacity <= 0:
                    raise ValidationError(
                        new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                              f"Presentation {presentation.id} is full"))
                total_cost += presentation.cost
                presentations.append(presentation)
            except ObjectDoesNotExist:
                raise ValueError(f"User {user} is registered for presentation {presentation} but has no registration")
        if len(workshops) == 0 and len(presentations) == 0:
            raise ValidationError(
                new_detailed_response(status.HTTP_400_BAD_REQUEST, f"User {user} has no unpaid registrations"))
        payment = Payment.objects.create(user=user, amount=total_cost, year=datetime.date.today().year,
                                         date=datetime.datetime.now(), discount=discount)
        payment.workshops.set(workshops)
        payment.presentations.set(presentations)
        payment.save()
        return payment

    @property
    def discounted_amount(self):
        if self.discount is None:
            return self.amount if self.amount < self._DISCOUNT_THRESHOLD else int(
                self.amount * (1 - self._DISCOUNT_PERCENTAGE / 100))
        return int(self.amount * (1 - self.discount.discount_percent / 100))


class Committee(models.Model):
    profile = models.ImageField(verbose_name='profile', null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    year = models.IntegerField(blank=False, default=2020)

    def __str__(self):
        return self.first_name + ' ' + self.last_name + ' ' + str(self.description)


class Staff(models.Model):
    ROLE = [
        ("Team Lead", "TL"),
        ("Member", "MB"),
        ("Organizer", "OR")
    ]

    SECTIONS = [
        ("Organizers", "OR"),
        ("Executive", "EXC"),
        ("Scientific", "SCI"),
        ("Technical", "TCH"),
        ("Graphic", "GRP"),
        ("Marketing", "MRK")
    ]
    name = models.CharField(max_length=100, null=False, default="Human")
    role = models.CharField(max_length=100, null=False, default="Executive", choices=ROLE)
    image = models.ImageField(blank=True)
    section_name = models.CharField(max_length=100, null=False, default="Member", choices=SECTIONS)

    def __str__(self):
        return self.name
