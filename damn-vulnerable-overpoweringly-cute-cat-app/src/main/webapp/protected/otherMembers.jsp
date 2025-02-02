<%@ page import ="java.sql.*" %>
<%@ page import ="java.io.*" %>
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
<title>Protected area</title>
<link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/main.css">
</head>
<body id="cas">
	<div id="container">
		<jsp:include page="/header.jsp" />
		<div id="content">
			<div class="box" id="login">
		
				<h2>PROTECTED AREA</h2>

				<h2>Members Public Cat Pictures</h2>
				<form id="fm1" method="post" action="otherMembersShow.jsp">
					<section class="row">
                        <h3>Select User To View Their Public Cat Pictures</h3>
                    </section>
					<section class="row">
						<label>Select User</label>
						<select name="user">
						<%
							Class.forName("com.mysql.jdbc.Driver");
							Connection con2 = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
							Statement st2 = con2.createStatement();
							ResultSet rs1 = st2.executeQuery("select uname from catlovers");
							while (rs1.next()) {
								String user = rs1.getString("uname");
								%>
							   <option value="<% out.print(user); %>"><% out.print(user); %></option>
								<%
							}
						%>
						</select>
					</section>
					<section class="row btn-row">
                        <input type="submit" value="Submit" />
                        <input type="reset" value="Reset" />
                    </section>
				</form>	

				<br/><br/>
				
				<h3>What do you want to do?</h3>
				<dl>
					<dt>I need to </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/">See Overpoweringly Cute Cats</a></dd>
					<dt>The cats are overpowing me take me: </dt>
					<dd><a href="<%= request.getContextPath() %>">back to other area</a></dd>
				</dl>
			</div>
		</div>
	</div>									
</body>
</html>
<%
st2.close();
con2.close();
%>