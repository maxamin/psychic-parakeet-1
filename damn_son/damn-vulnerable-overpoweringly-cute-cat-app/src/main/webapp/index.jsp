
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
				<h2>PUBLIC AREA</h2>
				<h3>What do you want to do?</h3>
				<p>					
					<a href="<%= request.getContextPath() %>/protected/">See Overpoweringly Cute Cats</a>
				    <br/><br/><a href="<%= request.getContextPath() %>/register.jsp">Register so you can see Overpoweringly Cute Cats</a>
					<br/><a href="<%= request.getContextPath() %>/forgotpassword.jsp">Forgot your password?</a>
				</p>
			</div>
		</div>
	</div>
</body>
</html>