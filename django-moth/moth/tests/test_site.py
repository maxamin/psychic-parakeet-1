from django.test import TestCase


class SiteTestCase(TestCase):
    def test_home(self):
        response = self.client.get('/')
        
        # pylint: disable=E1103
        self.assertIn('A set of vulnerable scripts', response.content)
        self.assertTemplateUsed(response, 'moth/base.html')
        self.assertTemplateUsed(response, 'moth/home.html')
        
        self.assertIn('<li><a href="/grep/">Grep</a></li>', response.content)
        self.assertIn('<li><a href="/audit/">Audit</a></li>', response.content)
        
    def test_about(self):
        response = self.client.get('/about/')
        
        # pylint: disable=E1103
        self.assertIn('This software is the evolution', response.content)
        self.assertTemplateUsed(response, 'moth/base.html')
        self.assertTemplateUsed(response, 'moth/about.html')