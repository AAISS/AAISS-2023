import datetime
import os
import urllib.parse

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404, redirect
from rest_framework import status, mixins
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny
)
from rest_framework.response import Response

from aaiss_backend.settings import BASE_URL
from backend_api import models
from backend_api import serializers
from backend_api.models import User, Account, Payment, Staff, WorkshopRegistration, PresentationParticipation
from backend_api.serializers import WorkshopRegistrationSerializer, PresentationParticipationSerializer
from payment_backends.zify import ZIFYRequest, ZIFY_STATUS_OK
from utils.renderers import new_detailed_response


class FieldOfInterestViewSet(viewsets.ViewSet):
    serializer_class = serializers.FieldOfInterestSerializer

    def list(self, request, **kwargs):
        queryset = models.FieldOfInterest.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class CommitteeViewSet(viewsets.ViewSet):
    serializer_class = serializers.CommitteeSerializer

    def list(self, request, **kwargs):
        queryset = models.Committee.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class TeacherViewSet(viewsets.ViewSet):
    serializer_class = serializers.TeacherSerializer

    def list(self, request, year=None, **kwargs):
        queryset = models.Teacher.objects.filter(year=year)
        serializer = self.serializer_class(queryset, many=True)
        for teacher_data in serializer.data:
            teacher = get_object_or_404(queryset, pk=teacher_data['id'])
            teacher_data['workshops'] = dict()
            for workshop in models.Workshop.objects.filter(teachers=teacher).all():
                teacher_data['workshops'][workshop.id] = workshop.name
        response = list(serializer.data)
        response.sort(key=lambda k: k['order'])
        return Response(response)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Teacher.objects.filter(year=year)
        teacher = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(teacher)
        workshops = []
        for workshop in models.Workshop.objects.filter(teachers=teacher).all():
            workshops.append(workshop.id)
        response = serializer.data
        response['workshops'] = workshops
        return Response(response)


class PresenterViewSet(viewsets.ViewSet):
    serializer_class = serializers.PresenterSerializer

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Presenter.objects.filter(year=year)
        serializer = self.serializer_class(queryset, many=True)
        response = list(serializer.data)
        response.sort(key=lambda k: k['order'])
        return Response(response)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Presenter.objects.filter(year=year)
        presenter = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(presenter)
        presentations = []
        for presentation in models.Presentation.objects.filter(presenters=presenter).all():
            presentations.append(presentation.id)
        response = serializer.data
        response['presentations'] = presentations
        return Response(response)


class WorkshopViewSet(viewsets.GenericViewSet,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin):
    serializer_class = serializers.WorkshopSerializer
    queryset = models.Workshop.objects.all()

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Workshop.objects.filter(year=year)
        return super().list(request, queryset=queryset, **kwargs)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Workshop.objects.filter(year=year)
        return super().retrieve(request, pk=pk, queryset=queryset)


class PresentationViewSet(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin):
    serializer_class = serializers.PresentationSerializer
    queryset = models.Presentation.objects.all()

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = self.queryset.filter(year=year)
        return super().list(request, queryset=queryset, **kwargs)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Presentation.objects.filter(year=year)
        return super().retrieve(request, pk=pk, queryset=queryset)


class MiscViewSet(viewsets.ViewSet):
    serializer_class = serializers.MiscSerializer

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Misc.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Misc.objects.all()
        misc = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(misc)
        return Response(serializer.data)


class UserViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.UpdateModelMixin):
    serializer_class = serializers.UserSerializer
    permission_classes_by_action = {
        'list': [IsAdminUser],
        'create': [AllowAny],
        'retrieve': [IsAuthenticated],
        'destroy': [IsAdminUser],
        'update': [IsAuthenticated],
        'activate': [AllowAny]
    }

    def get_queryset(self):
        """
        Superusers can see all users, normal users can only see themselves
        """
        user: Account = self.request.user
        if user.is_superuser:
            return models.User.objects.all()
        return User.objects.filter(pk=user.pk)

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = serializers.UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: User = serializer.save()
        user.account.is_active = False
        user.account.save()
        user.account.send_registration_email()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['GET'], detail=False)
    def activate(self, request):
        if not request.query_params.get('token'):
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "Token must be in query params"))
        token = request.query_params.get('token')
        try:
            account = Account.objects.get(activation_code=token)
        except ObjectDoesNotExist:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "Token didn't match with any user"))
        account.is_active = True
        account.save()
        return redirect(urllib.parse.urljoin(BASE_URL, 'signup'))


class PaymentViewSet(viewsets.GenericViewSet):
    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated])
    def payment(self, request):
        account = request.user
        try:
            user = User.objects.get(account=account)
        except ObjectDoesNotExist:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "User not found"))

        payment = Payment.create_payment_for_user(user)
        response = ZIFYRequest().create_payment(str(payment.pk), payment.amount, user.name, user.phone_number,
                                                user.account.email)
        if response['status'] == ZIFY_STATUS_OK:
            payment.track_id = response['data']['order']
            payment.save()
            return Response(new_detailed_response(status.HTTP_200_OK, "Payment created successfully",
                                                  {'payment_url': ZIFYRequest.get_order_url(payment.track_id)}))
        else:
            return Response(
                new_detailed_response(response['status'], response["message"]))

    @action(methods=['GET'], detail=False)
    def verify(self, request):
        pid = request.GET.get('clientrefid')
        if pid is None:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "clientrefid is required"))
        try:
            payment = Payment.objects.get(pk=pid)
        except ObjectDoesNotExist:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "Payment not found"))
        response = ZIFYRequest().verify_payment(payment.track_id)
        if response['status'] == ZIFY_STATUS_OK:
            payment.update_payment_status(Payment.PaymentStatus.PAYMENT_CONFIRMED)
            # FIXME: redirect to payment success page
            return Response(new_detailed_response(status.HTTP_200_OK, "Payment verified successfully"))
        else:
            payment.update_payment_status(Payment.PaymentStatus.PAYMENT_REJECTED)
            return Response(
                new_detailed_response(response['status'], response["message"]))


class StaffViewSet(viewsets.GenericViewSet,
                   mixins.ListModelMixin):
    queryset = Staff.objects.all()

    def list(self, request, *args, **kwargs):
        data = []
        for section in Staff.SECTIONS:
            section_data = {
                'section': section[0],
                'people': []
            }

            for staff_member in self.queryset:
                if staff_member.section_name == section[0]:
                    person_data = {
                        'name': staff_member.name,
                        'role': staff_member.role,
                        'img': staff_member.image.url if staff_member.image.name != "" else ""
                    }

                    section_data['people'].append(person_data)
                
            if len(section_data['people']) != 0:
                section_data['people'] = sorted(section_data['people'], key=lambda x: x['role'])[::-1]
                data.append(section_data)

        serializer = serializers.AllStaffSectionSerializer(data, many=True)
        return Response(serializer.data)


class WorkshopRegistrationViewSet(viewsets.GenericViewSet,
                                  mixins.ListModelMixin,
                                  mixins.CreateModelMixin,
                                  mixins.DestroyModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkshopRegistrationSerializer

    def get_queryset(self):
        return WorkshopRegistration.objects.filter(user=User.objects.get(account=self.request.user))

    def create(self, request, *args, **kwargs):
        data = super().create(request, *args, **kwargs)
        return Response(new_detailed_response(status.HTTP_201_CREATED, "Registration successful", data.data))

    def destroy(self, request, *args, **kwargs):
        # TODO: handle this method using serializers properly
        account = request.user
        try:
            user = User.objects.get(account=account)
        except ObjectDoesNotExist:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "User not found"))
        workshop_pk = kwargs.get('pk')
        try:
            workshop = user.registered_workshops.get(pk=workshop_pk)
            user.registered_workshops.remove(workshop)
            return Response(new_detailed_response(status.HTTP_200_OK, "Registration cancelled successfully"))
        except ObjectDoesNotExist:
            return Response(new_detailed_response(status.HTTP_400_BAD_REQUEST, "Workshop not found"))


class PresentationRegistrationViewSet(viewsets.GenericViewSet,
                                      mixins.ListModelMixin,
                                      mixins.CreateModelMixin,
                                      mixins.DestroyModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = PresentationParticipationSerializer

    def get_queryset(self):
        return PresentationParticipation.objects.filter(user=User.objects.get(account=self.request.user))

    def create(self, request, *args, **kwargs):
        data = super().create(request, *args, **kwargs)
        return Response(new_detailed_response(status.HTTP_201_CREATED, "Participation added successfully", data.data))

    def destroy(self, request, *args, **kwargs):
        # TODO: handle this method using serializers properly
        account = request.user
        try:
            user = User.objects.get(account=account)
        except ObjectDoesNotExist:
            return Response(new_detailed_response(
                status.HTTP_400_BAD_REQUEST, "User not found"))
        presentation_pk = kwargs.get('pk')
        try:
            presentation = user.participated_presentations.get(pk=presentation_pk)
            user.participated_presentations.remove(presentation)
            return Response(new_detailed_response(status.HTTP_200_OK, "Participation cancelled successfully"))
        except ObjectDoesNotExist:
            return Response(new_detailed_response(status.HTTP_400_BAD_REQUEST, "Presentation not found"))
