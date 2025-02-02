
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Public area</title>
<link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/main.css">
</head>
<body id="cas">
	<div id="container">
		<jsp:include page="/header.jsp" />
		<div id="content">
			<div class="box" id="login">
				<h2>REGISTRATION</h2>
				<form id="fm1" method="post" action="registration.jsp">
					<section class="row">
                        <h3>Enter Information Here</h3>
                    </section>
                    <section class="row">
                        <label>Cat's Name</label>
                        <input type="text" name="catname" value="" />
                    </section>
                    <section class="row">
                        <label>Email</label>
                        <input type="text" name="email" value="" />
                    </section>
                    <section class="row">
                        <label>User Name</label>
                        <input type="text" name="uname" value="" />
                    </section>
                    <section class="row">
                        <label>Password</label>
                        <input type="password" name="pass" value="" />
                    </section>
					<section class="row">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPass" value="" />
                    </section>
					<section class="row">
						<label>Select a security question</label>
						<select name="securityQuestion">
							<option value="petName">What is your pet's name?</option>
							<option value="iceCream">What is your favorite ice cream flavor?</option>
							<option value="cityBorn">What city were you born?</option>
							<option value="highSchool">Where did you go to high school?</option>
						</select>
					</section>
					<section class="row">
                        <label>Security Question Answer</label>
                        <input type="text" name="answer" value="" />
                    </section>
                    <section class="row btn-row">
                        <input type="submit" value="Submit" />
                        <input type="reset" value="Reset" />
                    </section>
                    <section class="row">
                        Already registered!! <a href="<%= request.getContextPath() %>/protected/">See Overpoweringly Cute Cats</a>
                    </section>
				</form>
			</div>
		</div>
	</div>
</body>
</html>