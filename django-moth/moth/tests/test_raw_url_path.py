from django.test import TestCase


class RawURLPathTestCase(TestCase):
    def test_raw_url(self):
        # Tests RawPathTemplateView
        response = self.client.get('/iamhidden.txt')

        # pylint: disable=E1103
        self.assertEqual(200, response.status_code)