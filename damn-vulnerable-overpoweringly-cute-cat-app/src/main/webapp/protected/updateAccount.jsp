<%@ page import ="java.sql.*" %>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	Class.forName("com.mysql.jdbc.Driver");
	Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
	String userName = request.getRemoteUser();	
	String pwd = request.getParameter("pass");
	String confirmPwd = request.getParameter("confirmPass");
	String catname = request.getParameter("catname");
	String securityQuestion = request.getParameter("securityQuestion");
	String answer = request.getParameter("answer");
	String redirectURL = request.getParameter("redirect");
	Boolean error = false;

	if (pwd == null || confirmPwd == null || catname == null  || securityQuestion == null || answer == null) {
		error = true;
	} else if (pwd.isEmpty() || confirmPwd.isEmpty() || catname.isEmpty()  || securityQuestion.isEmpty() || answer.isEmpty()) {
		error = true;
	} else if (!pwd.equals(confirmPwd)) {
		error = true;
	}
	if (!error) {	
		Statement st1 = con.createStatement();
		int i = st1.executeUpdate("update catlovers set cat_name = '" + catname + "',  pass = '" + pwd  + 
			"', securityQuestion = '" + securityQuestion + "', answer =  '" + answer  + "' where uname = '" + userName + "'");
		if (i > 0) {
		%>
			<h2>UPDATE SUCCESSFUL</h2>
		<%
		}
		st1.close();
		con.close();
		response.sendRedirect(redirectURL);
		
	} else {
		Statement st2 = con.createStatement();
		ResultSet rs1 = st2.executeQuery("select * from catlovers where uname = '" + userName + "'");
		if (rs1.next()) {
			pwd = rs1.getString("pass");
			confirmPwd = pwd;
			catname = rs1.getString("cat_name");
			securityQuestion = rs1.getString("securityQuestion");
			answer = rs1.getString("answer");
		}
		st2.close();
	}
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
				<h2>UPDATE ACCOUNT</h2>
				<form id="fm1" method="post" action="updateAccount.jsp">
					<section class="row">
                        <h3>Enter Information Here</h3>
                    </section>
                    <section class="row">
                        <label>Cat's Name</label>
                        <input type="text" name="catname" value="<%= catname %>" />
                    </section>
                    <section class="row">
                        <label>Password</label>
                        <input type="password" name="pass" value="<%= pwd %>" />
                    </section>
					<section class="row">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPass" value="<%= confirmPwd %>" />
                    </section>
					<section class="row">
						<label>Select a security question</label>
						<select name="securityQuestion" value="<%= securityQuestion %>">
							<option value="petName">What is your pet's name?</option>
							<option value="iceCream">What is your favorite ice cream flavor?</option>
							<option value="cityBorn">What city were you born?</option>
							<option value="highSchool">Where did you go to high school?</option>
						</select>
					</section>
					<section class="row">
                        <label>Security Question Answer</label>
                        <input type="text" name="answer" value="<%= answer %>" />
                    </section>
                    <section class="row btn-row">
			<input type="hidden" name="redirect" value="<%= request.getContextPath() %>/protected/" />
                        <input type="submit" value="Submit" />
                        <input type="reset" value="Reset" />
                    </section>
                    <section class="row">
                        Back to your private area<a href="<%= request.getContextPath() %>/protected/">See Your Overpoweringly Cute Cats</a>
                    </section>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
<%
con.close();
%>
