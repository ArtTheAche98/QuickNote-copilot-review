from rest_framework import serializers
from .models import Note

# REVIEW_MARKER: Copilot review context
class NoteSerializer(serializers.ModelSerializer):
    tags_list = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'text', 'tags', 'tags_list', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        return obj.get_tags_list()