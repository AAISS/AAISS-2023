from rest_framework import serializers

from backend_api import models
from backend_api.models import User, Account, Presentation, WorkshopRecord


def all_serializer_creator(selected_model):
    class Serializer(serializers.ModelSerializer):
        class Meta:
            model = selected_model
            fields = '__all__'

    return Serializer


FieldOfInterestSerializer = all_serializer_creator(models.FieldOfInterest)
TeacherSerializer = all_serializer_creator(models.Teacher)
PresenterSerializer = all_serializer_creator(models.Presenter)
WorkshopSerializer = all_serializer_creator(models.Workshop)
PresentationSerializer = all_serializer_creator(models.Presentation)
MiscSerializer = all_serializer_creator(models.Misc)
CommitteeSerializer = all_serializer_creator(models.Committee)
StaffSerializer = all_serializer_creator(models.Staff)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('email', 'password')


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    registered_workshops = WorkshopSerializer(many=True, required=False)
    participated_presentations = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'account', 'name', 'fields_of_interest', 'phone_number', 'registered_workshops',
            'participated_presentations')

    def get_participated_presentations(self, obj):
        if obj.registered_for_presentations:
            return PresentationSerializer(Presentation.objects.all(), many=True).data
        return None

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


class WritableSerializerMethodField(serializers.SerializerMethodField):
    def __init__(self, method_name=None, **kwargs):
        super().__init__(**kwargs)
        self.read_only = False

    def get_default(self):
        default = super().get_default()
        return {
            self.field_name: default
        }

    def to_internal_value(self, data):
        return {self.field_name: data}


class WorkshopRecordSerializer(serializers.ModelSerializer):
    workshop = WritableSerializerMethodField()
    status = serializers.CharField(source='get_status_display', read_only=True)

    def get_workshop(self, obj):
        return WorkshopSerializer(obj.workshop).data

    def create(self, validated_data):
        print('\n\n', validated_data)
        return super().create(validated_data)

    class Meta:
        model = WorkshopRecord
        fields = '__all__'
