import datetime
import datetime
import json
from threading import Thread

from django.shortcuts import get_object_or_404, redirect
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny
)
from rest_framework.response import Response

from aaiss_backend import settings
from backend_api import models
from backend_api import serializers
from backend_api.email import send_simple_email
from backend_api.idpay import IdPayRequest, IDPAY_PAYMENT_DESCRIPTION, \
    IDPAY_CALL_BACK, IDPAY_STATUS_201, IDPAY_STATUS_100, IDPAY_STATUS_101, \
    IDPAY_STATUS_200
from backend_api.models import User, Account


class FieldOfInterestViewSet(viewsets.ViewSet):
    serializer_class = serializers.FieldOfInterestSerializer

    def list(self, request, **kwargs):
        queryset = models.FieldOfInterest.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class StaffViewSet(viewsets.ViewSet):
    serializer_class = serializers.StaffSerializer

    def list(self, request, **kwargs):
        queryset = models.Staff.objects.all()
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


class WorkshopViewSet(viewsets.ViewSet):
    serializer_class = serializers.WorkshopSerializer

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Workshop.objects.filter(year=year)
        serializer = self.serializer_class(queryset, many=True)
        for workshop_data in serializer.data:
            workshop = get_object_or_404(queryset, pk=workshop_data['id'])
            workshop_data['is_full'] = (
                    len(models.User.objects.filter(registered_workshops=workshop).all()) >= workshop.capacity)
        return Response(serializer.data)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Workshop.objects.filter(year=year)
        workshop = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(workshop)
        response = dict(serializer.data)
        response['is_full'] = (
                len(models.User.objects.filter(registered_workshops=workshop).all()) >= workshop.capacity)
        return Response(response)


class PresentationViewSet(viewsets.ViewSet):
    serializer_class = serializers.PresentationSerializer

    def list(self, request, year=None, **kwargs):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Presentation.objects.filter(year=year)
        serializer = self.serializer_class(queryset, many=True)
        total_registered_for_presentation = len(models.User.objects.filter(registered_for_presentations=True).all())
        response = list(serializer.data)
        response.append(
            {'is_full': total_registered_for_presentation >= int(models.Misc.objects.get(pk='presentation_cap').desc)})
        return Response(response)

    def retrieve(self, request, year=None, pk=None):
        if year is None:
            year = datetime.datetime.now().year
        queryset = models.Presentation.objects.filter(year=year)
        presentation = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(presentation)
        return Response(serializer.data)


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


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes_by_action = {
        # TODO: assert that the owner of the target object is the same as the user requesting
        'list': [IsAdminUser],
        'create': [AllowAny],
        'retrieve': [IsAuthenticated],
        'destroy': [IsAdminUser],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
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


def send_register_email(user, workshops, presentation):
    subject = 'AAISS registration'
    body = render_to_string('AAISS_Info.html',
                            {'name': user.name, 'workshops_text': ', '.join([w.name for w in workshops]),
                             'presentation': presentation})
    Thread(target=send_simple_email, args=(subject, user.account.email, body)).start()


class NewPaymentAPIView(viewsets.ModelViewSet):
    serializer_class = serializers.PaymentInitSerializer
    client = IdPayRequest()

    def payment(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = None
            try:
                user = models.User.objects.get(
                    pk=models.Account.objects.get(email=str(serializer.validated_data.get('email')).lower()))
            except:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if user is None:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            workshop_queryset = models.Workshop.objects.all()
            workshops = []
            full_workshops = []
            presentation = False
            total_price = 0
            if serializer.validated_data.get('workshops') is not None:
                for pkid in serializer.validated_data.get('workshops'):
                    workshop = get_object_or_404(workshop_queryset, pk=pkid)
                    if len(models.User.objects.filter(registered_workshops=workshop).all()) >= workshop.capacity:
                        full_workshops.append(workshop.name)
                    else:
                        workshops.append(workshop)
                        total_price += workshop.cost
            if len(full_workshops) > 0:
                return Response({'message': 'some are selected workshops are full', 'full_workshops': full_workshops},
                                status=status.HTTP_400_BAD_REQUEST)

            total_registered_for_presentation = len(models.User.objects.filter(registered_for_presentations=True).all())
            if total_registered_for_presentation >= int(models.Misc.objects.get(
                    pk='presentation_cap').desc) and serializer.validated_data.get('presentations'):
                return Response({'message': 'Presentations are full'}, status=status.HTTP_400_BAD_REQUEST)

            if serializer.validated_data.get('presentations'):
                total_price += int(get_object_or_404(models.Misc.objects.all(), pk='presentation_fee').desc)
                presentation = True
            if total_price == 0:
                new_registered_workshops = []
                for ws in user.registered_workshops.all():
                    new_registered_workshops.append(ws)
                for pws in workshops:
                    new_registered_workshops.append(pws)
                user.registered_workshops.set(new_registered_workshops)
                user.registered_for_presentations = presentation or user.registered_for_presentations
                user.save()
                send_register_email(user=user, workshops=workshops,
                                    presentation=presentation)
                res = {}
                res['status'] = 200
                res['link'] = F'{settings.BASE_URL}?payment_status=true'
                res['message'] = res['link']
                return Response(res)
            payment = models.NewPayment.objects.create(
                total_price=total_price,
                user=user,
                presentation=presentation
            )

            result = IdPayRequest().create_payment(
                order_id=payment.pk,
                amount=int(total_price * 10),
                desc=IDPAY_PAYMENT_DESCRIPTION,
                mail=user.account.email,
                phone=user.phone_number,
                callback=IDPAY_CALL_BACK,
                name=user.name
            )
            if result['status'] == IDPAY_STATUS_201:
                payment.created_date = datetime.datetime.now()
                payment.payment_id = result['id']
                payment.payment_link = result['link']
                payment.workshops.set(workshops)
                payment.save()
                result['message'] = result['link']
                return Response(result)
            else:
                return Response({'message': 'Payment Error with code: ' + str(result['status'])},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

    def verify(self, request):
        try:
            request_body = request.data
            idPay_payment_id = request_body['id']
            order_id = request_body['order_id']
            payment = models.NewPayment.objects.get(pk=order_id)
            payment.card_number = request_body['card_no']
            payment.hashed_card_number = request_body['hashed_card_no']
            payment.payment_trackID = request_body['track_id']
            result = IdPayRequest().verify_payment(
                order_id=order_id,
                payment_id=idPay_payment_id,
            )
            result_status = result['status']

            if not (
                    any(result_status == status_code for status_code in
                        (IDPAY_STATUS_100, IDPAY_STATUS_101, IDPAY_STATUS_200))):
                payment.status = result_status
                payment.original_data = json.dumps(result)
                payment.save()
                return redirect(F'{settings.BASE_URL}?payment_status=false')

            payment.status = result_status
            payment.original_data = json.dumps(result)
            payment.verify_trackID = result['track_id']
            payment.finished_date = datetime.datetime.utcfromtimestamp(
                int(result['date']))
            payment.verified_date = datetime.datetime.utcfromtimestamp(
                int(result['verify']['date']))
            payment.save()
            new_registered_workshops = []
            for ws in payment.user.registered_workshops.all():
                new_registered_workshops.append(ws)
            for pws in payment.workshops.all():
                new_registered_workshops.append(pws)
            payment.user.registered_workshops.set(new_registered_workshops)
            payment.user.registered_for_presentations = (
                    payment.user.registered_for_presentations or payment.presentation)
            payment.user.save()
            payment.save()
            response_data = dict()
            user_workshops = dict()
            for workshop in payment.user.registered_workshops.all():
                user_workshops[workshop.id] = workshop.name
            response_data['workshops'] = user_workshops
            response_data['presentation'] = payment.user.registered_for_presentations
            send_register_email(user=payment.user, workshops=payment.workshops.all(),
                                presentation=payment.presentation)
            return redirect(F'{settings.BASE_URL}?payment_status=true')
        except Exception as e:
            print('Exception: ', e.__str__())
            return redirect(F'{settings.BASE_URL}?payment_status=false')
