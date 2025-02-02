from django.shortcuts import render
from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Submit

from moth.views.base.form_template_view import FormTemplateView


class UploadForm(forms.Form):
    _file = forms.FileField()

    def __init__(self, * args, **kwargs):
        # pylint: disable=E1002
        super(UploadForm, self).__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.form_id = 'upload'
        self.helper.form_action = 'upload.py'
        self.helper.form_method = 'post'
        self.helper.form_class = 'form-horizontal'
        
        submit = Submit('Upload', 'Upload', css_class="btn-success")

        # generate layout
        self.helper.layout = Layout(
                                    Field('_file'),
                                    submit
        )


class ContactView(FormTemplateView):
    form_class = UploadForm
    title = description = 'File uploads using multipart'
    url_path = 'upload.py'
    form_klass = UploadForm

    def post(self, request, *args, **kwargs):
        has_files = bool(request.FILES)
        msg = 'The file was was successfully uploaded' if has_files else 'Error!'
        
        context = self.get_context_data()
        context['message'] = msg
        
        return render(request, self.template_name, context)
        