
<%@ page import ="java.sql.*" %>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
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
<%
	String user = request.getParameter("uname");
	String pwd = request.getParameter("pass");
	String confirmPwd = request.getParameter("confirmPass");

	Boolean error = false;

    if (!pwd.equals(confirmPwd)) {
		error = true;
	}
	if (user.isEmpty() || pwd.isEmpty() || confirmPwd.isEmpty()) {
		error = true;
	}
	Class.forName("com.mysql.jdbc.Driver");
	Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
	if (!error) {	
		Statement st = con.createStatement();
		int i = st.executeUpdate("update catlovers set pass ='" + pwd  + "' where uname = '" + user + "'");
		if (i > 0) {
		%>
				<h2>PASSWORD CHANGE SUCCESSFUL</h2>
				<h3>What do you want to do?</h3>
				<p>					
					<a href="<%= request.getContextPath() %>/protected/">See Overpoweringly Cute Cats</a>
		<%
		} else {
		%>
			<h2>An error occurred.  Please contact a catAdmin</h2>
		<%
		}
		st.close();
	} else {
	%>
		<h2>An error occurred.  Please try again or contact a catAdmin</h2>
	<%
	}
%>
			</div>
		</div>
	</div>
</body>
</html>
<%

con.close();
%>