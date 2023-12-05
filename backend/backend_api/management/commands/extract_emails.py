

from django.core.management.base import BaseCommand
from backend_api.models import WorkshopRegistration, PresentationParticipation
import pandas as pd
# from openpyxl import Workbook 
import random
import string

 



        
class Command(BaseCommand):
    help = 'Extract user emails for WorkshopRegistration and PresentationParticipation models and save as separate JSON files'
    
    def handle(self, *args, **options):
        data_ws = self.extract_data(WorkshopRegistration.objects.all())
        data_pr = self.extract_data(PresentationParticipation.objects.all())
        self.save_xlsx(data_ws, prefix="workshop")
        self.save_xlsx(data_pr, prefix="presentation")
            
            
            
    def extract_data(self, queryset):
        res = {}
        for registration in queryset:
            event_name = registration.workshop.name  
            if (event_name not in res.keys()):
                res[event_name] = []
            result = {
                'username': registration.username,
                'password': registration.password,
                'FullName': registration.user.name,
                "room": "aaiss",
                "access": "normal"
                
            }
            
            res[event_name].append(result)
        return res

    def save_xlsx(self, data, prefix):
        for key, data_list in data.items():
            df = pd.DataFrame(data_list)
            file_name = "{}[{}]_data.xlsx".format(key, prefix)
            df.to_excel(file_name, index=False, header=None, engine='openpyxl', startrow=0)
            with pd.ExcelWriter(file_name, engine='openpyxl', mode='a') as writer:
                writer.sheets["Sheet1"].sheet_view.rightToLeft = True
            self.stdout.write(self.style.SUCCESS(f'save for {key} in {file_name}'))