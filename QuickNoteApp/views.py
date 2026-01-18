from rest_framework import viewsets
from django.db.models import Q
from .models import Note
from .serializers import NoteSerializer

# REVIEW_MARKER: Copilot review context
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def get_queryset(self):
        queryset = Note.objects.all()
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(text__icontains=search) |
                Q(tags__icontains=search)
            )

        sort = self.request.query_params.get('sort', '-updated_at')
        if sort in ['updated_at', '-updated_at', 'created_at', '-created_at']:
            queryset = queryset.order_by(sort)

        return queryset