from moth.views.base.html_template_view import HTMLTemplateView


class FormAutocompleteFormOff(HTMLTemplateView):
    title = 'Form auto-complete test (off)'
    description = 'Form auto-complete disabled at form tag.'
    url_path = 'form-off.html'
    
    HTML = '''
    <form action="/login1" autocomplete="off">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFieldOff(HTMLTemplateView):
    title = 'Form auto-complete test (field off)'
    description = 'Form auto-complete disabled at input tag.'
    url_path = 'field-off.html'
    
    HTML = '''
    <form action="/ssn1">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code" autocomplete="off"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteTwoFields(HTMLTemplateView):
    title = 'Form auto-complete test (two fields)'
    description = 'Form auto-complete disabled with two fields'
    url_path = 'form-two-fields.html'
    
    HTML = '''
    <form action="/ssn2">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code" autocomplete="on"><br/>
        Extra: <input type="password" name="extra" autocomplete="off"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFormOnFieldOff(HTMLTemplateView):
    title = 'Form auto-complete test (off/on)'
    description = 'Form auto-complete disabled at input tag, enabled in form tag.'
    url_path = 'form-on-field-off.html'
    
    HTML = '''
    <form action="/ssn3" autocomplete="on">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code" autocomplete="off"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFormOnFieldOn(HTMLTemplateView):
    title = 'Form auto-complete test (on/on)'
    description = 'Form auto-complete enabled in both form and field.'
    url_path = 'form-on-field-on.html'
    
    HTML = '''
    <form action="/ssn4" autocomplete="on">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code" autocomplete="on"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFormOffNoPassOn(HTMLTemplateView):
    title = 'Form auto-complete test without password field'
    description = 'Form auto-complete without password field.'
    url_path = 'form-off-no-pass-on.html'
    
    HTML = '''
    <form action="/ssn5" autocomplete="off">
        SSN: <input type="text" name="ssn" autocomplete="on"><br/>
        Code: <input type="password" name="code"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFormOffFieldOn(HTMLTemplateView):
    title = 'Form auto-complete with form off and field on.'
    description = 'Form auto-complete which has been disabled in the form tag'\
                  ' and then enabled in the input tag.'
    url_path = 'form-off-field-on.html'
    
    HTML = '''
    <form action="/ssn6" autocomplete="off">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code" autocomplete="on"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteFormOn(HTMLTemplateView):
    title = 'Form auto-complete enabled in the form tag'
    description = 'Form auto-complete enabled in the form tag'
    url_path = 'form-on.html'
    
    HTML = '''
    <form action="/ssn7" autocomplete="on">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code"><br/>
        <input type="submit">
    </form>
    '''


class FormAutocompleteDefault(HTMLTemplateView):
    title = 'Form auto-complete browser default'
    description = 'Form auto-complete test for default settings used in browsers'
    url_path = 'form-default.html'
    
    HTML = '''
    <form action="/ssn8">
        SSN: <input type="text" name="ssn"><br/>
        Code: <input type="password" name="code"><br/>
        <input type="submit">
    </form>
    '''

