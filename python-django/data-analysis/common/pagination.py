from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'pageSize'

    def get_paginated_response(self, data):
        return Response({
            'msg': 'Success!!',
            'meta': {
                'current_page': self.page.number,
                'is_next_page': self.page.has_next(),
                'next_page': self.get_next_link(),
                'total_count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages
            },
            'data': data, 
            'status':1
        }, status=status.HTTP_200_OK)