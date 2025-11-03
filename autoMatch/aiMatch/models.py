from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class ApplicantTrackingSystem(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class ApplicationStage(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True, null=True)
    ats = models.ForeignKey(ApplicantTrackingSystem, on_delete=models.CASCADE)

    def __str__(self):
        return f'[{self.ats.name}] - {self.name}'


# an object of this class represents the logic to map a stage of a given ATS to the appropriate HirePort application stage
class ApplicationStageMapping(models.Model):

    class HirePortApplicationStages(models.TextChoices):
        JOBREQUISITION = "JR", _("Job Requisition and Approval")
        JOBPOSTING = "JP", _("Job Posting")
        APPLICATIONCOLLECTION = "AC", _("Application Collection")
        SCREENING = "SN", _("Screening")
        INTERVIEW = "IP", _("Interview Process")
        FEEDBACK = "FE", _("Feedback and Evaluation")
        OFFER = "OM", _("Offer Management")
        HIRING = "HO", _("Hiring and Onboarding")

    @classmethod
    def get_hireport_stage_list(cls):
        return [
            {
                "code": choice.value,
                "label": str(choice.label)
            }
            for choice in cls.HirePortApplicationStages
        ]

    ats_stage = models.OneToOneField(
        ApplicationStage,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    hireport_stage = models.CharField(
        max_length=2,
        choices = HirePortApplicationStages.choices,
        default=HirePortApplicationStages.JOBREQUISITION,
    )
    explanation = models.CharField(max_length=500)

    def __str__(self):
        return f'[{self.ats_stage.ats.name}] - {self.ats_stage.name} -> [HirePort] - {self.hireport_stage}'

