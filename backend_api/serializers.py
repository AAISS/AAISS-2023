from rest_framework import serializers

from backend_api import models, validators
from backend_api.models import User, Account, FieldOfInterest


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
StaffSerializer = all_serializer_creator(models.Staff)
CommitteeSerializer = all_serializer_creator(models.Committee)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('email', 'password')


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = User
        fields = ('account', 'name', 'fields_of_interest', 'phone_number')

    def create(self, validated_data):
        account_data = validated_data.pop('account')
        account = Account.objects.create(**account_data)
        fields_of_interest = []
        if 'fields_of_interest' in validated_data:
            fields_of_interest = validated_data.pop('fields_of_interest')
        user = User.objects.create(account=account, **validated_data)
        for foi in fields_of_interest:
            user.fields_of_interest.add(foi)
        user.save()
        return user


class PaymentInitSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    workshops = serializers.ListField(child=serializers.IntegerField(min_value=0), required=False)
    presentations = serializers.BooleanField(required=False)
