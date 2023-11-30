

from django.core.management.base import BaseCommand
from backend_api.models import WorkshopRegistration, PresentationParticipation
import json
class Command(BaseCommand):
    help = 'Extract user emails for WorkshopRegistration and PresentationParticipation models and save as separate JSON files'

    def handle(self, *args, **options):

        workshop_registrations = WorkshopRegistration.objects.all()
        for registration in workshop_registrations:
            user_email = registration.user.account.email
            workshop_name = registration.workshop.name  
            output_file = f'workshop_{workshop_name}_user_emails.json'

            result = {'user_emails': [user_email]}

            with open(output_file, 'w') as json_file:
                json.dump(result, json_file)

            self.stdout.write(self.style.SUCCESS(f'Successfully saved user emails for {workshop_name} to {output_file}'))

        
        presentation_participations = PresentationParticipation.objects.all()
        for participation in presentation_participations:
            user_email = participation.user.account.email
            presentation_name = participation.presentation.name  
            output_file = f'presentation_{presentation_name}_user_emails.json'

            result = {'user_emails': [user_email]}

            with open(output_file, 'w') as json_file:
                json.dump(result, json_file)

            self.stdout.write(self.style.SUCCESS(f'Successfully saved user emails for {presentation_name} to {output_file}'))