from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers, status

from backend_api import models
from backend_api.models import User, Account, WorkshopRegistration, PresentationParticipation
from utils.renderers import new_detailed_response


def all_serializer_creator(selected_model):
    class Serializer(serializers.ModelSerializer):
        class Meta:
            model = selected_model
            fields = '__all__'

    return Serializer


FieldOfInterestSerializer = all_serializer_creator(models.FieldOfInterest)
TeacherSerializer = all_serializer_creator(models.Teacher)
PresenterSerializer = all_serializer_creator(models.Presenter)
MiscSerializer = all_serializer_creator(models.Misc)
CommitteeSerializer = all_serializer_creator(models.Committee)
StaffSerializer = all_serializer_creator(models.Staff)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('email', 'password')


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = User
        fields = (
            'account', 'name', 'fields_of_interest', 'phone_number',)

    def create(self, validated_data):
        account_data = validated_data.pop('account')
        account = Account.objects.create_user(**account_data)
        fields_of_interest = []
        if 'fields_of_interest' in validated_data:
            fields_of_interest = validated_data.pop('fields_of_interest')
        user = User.objects.create(account=account, **validated_data)
        for foi in fields_of_interest:
            user.fields_of_interest.add(foi)
        user.save()
        return user


class AllStaffSectionSerializer(serializers.Serializer):
    section = serializers.CharField()
    people = serializers.ListField(child=serializers.DictField())


class WorkshopSerializer(serializers.ModelSerializer):
    remaining_capacity = serializers.IntegerField()
    google_calendar_link = serializers.CharField()

    class Meta:
        model = models.Workshop
        exclude = ['recorded_link']


class PresentationSerializer(serializers.ModelSerializer):
    remaining_capacity = serializers.IntegerField()
    google_calendar_link = serializers.CharField()

    class Meta:
        model = models.Presentation
        exclude = ['recorded_link']


class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    workshop = serializers.PrimaryKeyRelatedField(queryset=WorkshopSerializer.Meta.model.objects.all())

    class Meta:
        model = WorkshopRegistration
        fields = ('workshop',)

    def create(self, validated_data):
        user = self.context['request'].user.user
        workshop = validated_data.pop('workshop')
        try:
            user.registered_workshops.get(pk=workshop.pk)
            self.is_valid(raise_exception=True)
            raise serializers.ValidationError(
                new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                      'User has already registered for this workshop.'))
        except ObjectDoesNotExist:
            user.registered_workshops.add(workshop)
        return user.workshopregistration_set.get(workshop=workshop)

    def to_representation(self, instance):
        # TODO: refactor this representation and handle it by DRF
        super_response = super().to_representation(instance)
        response = {}
        user = self.context['request'].user.user
        for key, val in super_response.items():
            response["id"] = val
            try:
                workshop_status = WorkshopRegistration.objects.get(user=user, workshop_id=val).status
                response["status"] = WorkshopRegistration.StatusChoices(workshop_status).name
            except ObjectDoesNotExist:
                pass
        return response


class PresentationParticipationSerializer(serializers.ModelSerializer):
    presentation = serializers.PrimaryKeyRelatedField(queryset=PresentationSerializer.Meta.model.objects.all())

    class Meta:
        model = PresentationParticipation
        fields = ('presentation',)

    def create(self, validated_data):
        user = self.context['request'].user.user
        presentation = validated_data.pop('presentation')
        try:
            user.participated_presentations.get(pk=presentation.pk)
            self.is_valid(raise_exception=True)
            raise serializers.ValidationError(
                new_detailed_response(status.HTTP_400_BAD_REQUEST,
                                      'User has already registered for this presentation.'))
        except ObjectDoesNotExist:
            user.participated_presentations.add(presentation)
        return user.presentationparticipation_set.get(presentation=presentation)

    def to_representation(self, instance):
        super_response = super().to_representation(instance)
        response = {}
        user = self.context['request'].user.user
        for key, val in super_response.items():
            response["id"] = val
            try:
                presentation_status = PresentationParticipation.objects.get(user=user, presentation_id=val).status
                response["status"] = PresentationParticipation.StatusChoices(presentation_status).name
            except ObjectDoesNotExist:
                pass
        return response
