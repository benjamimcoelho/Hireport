from rest_framework import serializers
from .models import ApplicantTrackingSystem, ApplicationStage, ApplicationStageMapping

class ApplicationStageMappingSerializer(serializers.ModelSerializer):
    stage_id = serializers.PrimaryKeyRelatedField(
        queryset=ApplicationStage.objects.all(), 
        source='ats_stage',
        write_only=True
    )

    class Meta:
        model = ApplicationStageMapping
        fields = ['stage_id', 'hireport_stage', 'explanation']

    def create(self, validated_data):
        ats_stage = validated_data.get('ats_stage')

        mapping, created = ApplicationStageMapping.objects.update_or_create(
            ats_stage=ats_stage,
            defaults={
                'hireport_stage': validated_data['hireport_stage'],
                'explanation': validated_data.get('explanation', '')
            }
        )
        return mapping

class ApplicationStageSerializer(serializers.ModelSerializer):
    mapping = ApplicationStageMappingSerializer(source='applicationstagemapping', read_only=True)

    class Meta:
        model = ApplicationStage
        fields = ['id', 'name', 'description', 'mapping']

class ApplicantTrackingSystemSerializer(serializers.ModelSerializer):
    stages = ApplicationStageSerializer(source='applicationstage_set', many=True)

    class Meta:
        model = ApplicantTrackingSystem
        fields = ['id', 'name', 'stages']

    
    def create(self, validated_data):
        print(validated_data)
        stages_data = validated_data.pop('applicationstage_set')
        ats = ApplicantTrackingSystem.objects.create(**validated_data)

        for stage_data in stages_data:
            ApplicationStage.objects.create(ats=ats, **stage_data)

        return ats
    
    def update(self, instance, validated_data):
        stages_data = validated_data.pop('applicationstage_set', [])

        instance.name = validated_data.get('name', instance.name)
        instance.save()

        instance.applicationstage_set.all().delete()

        for stage_data in stages_data:
            ApplicationStage.objects.create(ats=instance, **stage_data)

        return instance