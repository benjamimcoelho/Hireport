
from django.conf import settings
from rest_framework import viewsets
from aiMatch.models import ApplicantTrackingSystem, ApplicationStage, ApplicationStageMapping
from aiMatch.serializers import ApplicantTrackingSystemSerializer, ApplicationStageMappingSerializer
from groq import Groq
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

# Create your views here.
class ApplicantTrackingSystemViewSet(viewsets.ModelViewSet):
    queryset = ApplicantTrackingSystem.objects.all()
    serializer_class = ApplicantTrackingSystemSerializer

class ApplicationStageMappingViewSet(viewsets.ModelViewSet):
    queryset = ApplicationStageMapping.objects.all()
    serializer_class = ApplicationStageMappingSerializer



@api_view(["POST"])
def autoMatch(request):
    ats_id = request.data.get("atsId")
    if not ats_id:
        return Response({"error": "atsId is required"}, status=400)

    stages_to_map = ApplicationStage.objects.filter(ats__id=ats_id)
    hireport_stages = ApplicationStageMapping.get_hireport_stage_list()

    stage_data = [{"id": s.id, "name": s.name, "description": s.description} for s in stages_to_map]

    client = Groq(api_key=settings.GROK_API_KEY)

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
You are an expert in Applicant Tracking Systems. Your task is to map the application stages of a given ATS to the standardized application stages of Hireport.
Each ATS stage must be mapped to one Hireport stage. You may map multiple ATS stages to the same Hireport stage.
"""
            },
            {
                "role": "user",
                "content": f"ATS application stages: {json.dumps(stage_data)}"
            },
            {
                "role": "user",
                "content": f"Hireport application stages: {json.dumps(hireport_stages)}"
            },
            {
                "role": "user",
                "content": """
Return the mapping as a JSON array where each item contains:
- 'stage_id': the integer ID of the ATS stage,
- 'hireport_stage': one of the Hireport stage codes,
- 'explanation': a short justification.

Example:
[
  {
    "stage_id": 3,
    "hireport_stage": "SN",
    "explanation": "This is the resume screening step."
  }
]

The response should be a parsable JSON array. So it shouldn't contain anything else other than the JSON array
"""
            }
        ],
    model="llama-3.3-70b-versatile",
    )

    try:
  
        content = chat_completion.choices[0].message.content
        print("result", content)
        mapping_list = json.loads(content)
    except Exception as e:
        return Response({"error": "Failed to parse response", "details": str(e)}, status=500)

    created = []
    for item in mapping_list:
        try:
            stage = ApplicationStage.objects.get(id=item["stage_id"])
            mapping, _ = ApplicationStageMapping.objects.update_or_create(
                ats_stage=stage,
                defaults={
                    "hireport_stage": item["hireport_stage"],
                    "explanation": item["explanation"],
                },
            )
            created.append({
                "ats_stage_id": stage.id,
                "hireport_stage": mapping.hireport_stage,
                "explanation": mapping.explanation,
            })
        except Exception as e:
            print(f"Failed to save mapping for stage {item}: {e}")

    return Response({"created": created}, status=200)