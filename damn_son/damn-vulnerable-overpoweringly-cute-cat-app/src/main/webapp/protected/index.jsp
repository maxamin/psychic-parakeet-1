<%@ page import ="java.sql.*" %>
<%@ page import ="java.util.*" %>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
if (request.getRemoteUser().equals("catAdmin")) {
	Cookie cookie = new Cookie("isAdmin", "Yes");
	response.addCookie(cookie);	
}

%>
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

				<h3>Single Sign On data</h3>
				<dl>
					<dt>Your user name:</dt>
					<dd><%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %></dd>
				</dl>

				<%
					Class.forName("com.mysql.jdbc.Driver");
					Connection con2 = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
					Statement st2 = con2.createStatement();
					ResultSet rs1 = st2.executeQuery("select * from catphotos where uname = '" + request.getRemoteUser() + "'");
					if (rs1.next()) {
						String publicPic = rs1.getString("public");
						String privatePic = rs1.getString("private");
						if (privatePic.equals("y")) {
						%>
							<h3>Your Private Cat Picture</h3>
							<dl>
								<dt>Your private cute cat: </dt>
									<dd><img src="<%= request.getContextPath() %>/protected/images/private-<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>.jpg" /></dd>
							</dl>
						<%
						} else {
						%>
							<h2> You haven't uplaoded a private cute cat yet!  Do so below.  </h2>
						<%
						}
						if (publicPic.equals("y")) {
						%>		
							<h3>Your Public Cat Picture </h3>
							<dl>
								<dt>Your public cute cat: </dt>
								<dd><img src="<%= request.getContextPath() %>/protected/images/public-<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>.jpg"/></dd>
							</dl>
						<%
						} else {
						%>
							<h2> You haven't uplaoded a public cute cat yet!  Do so below.  </h2>
						<%
						}
					}
					%>
							<h3>What do you want to do?</h3>
				<dl>
					<dt>Update  </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/updateAccount.jsp">account info</a></dd>				
					<dt>Upload  </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/myCatPhotos.jsp">new private and public cat pictures </a></dd>
					<dt>See other and comment on other  </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/otherMembers.jsp">member's public cat pictures</a></dd>
					<dt>The cats are overpowing me take me: </dt>
					<dd><a href="<%= request.getContextPath() %>">back to other area</a></dd>
				</dl>
				<%
				Cookie[] cookies = request.getCookies();
				boolean isAdmin = false;

				for(int i = 0; i < cookies.length; i++) { 
					Cookie c = cookies[i];
					if (c.getName().equals("isAdmin") && c.getValue().equals("Yes")) {
						isAdmin = true;
					}
				}
				if (isAdmin) {
				%>
				<br/><br/>
				<h3>ADMIN OPTIONS</h3>
				<dl>				
					<dt>Admin View</dt>
					<dd><a href="<%= request.getContextPath() %>/protected/admin/viewPhotos.jsp">of others cat photos </a></dd>
				</dl>
				<%
				}
				%>
			</div>
		</div>
	</div>									
</body>
</html>
<%
st2.close();
con2.close();
%>