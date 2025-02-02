<%@ page import ="java.sql.*" %>
<%@ page import ="java.io.*" %>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>

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
<%					
		String message = null;
		String action = request.getParameter("action");
		String userToDelete = request.getParameter("user");
		Boolean deleteError = false;
		Class.forName("com.mysql.jdbc.Driver");
		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
		if (action == null || userToDelete == null) {
			deleteError = true;
		} else if (action.isEmpty() || userToDelete.isEmpty()) {
			deleteError = true;
		} else if (!action.equals("delete")) {
			deleteError = true;
		} 
		if (!deleteError) {
			String filePath = "C:\\Users\\leggosgirl\\Tools\\apache-tomcat-7.0.63\\webapps\\overpoweringly-cute-cats\\protected\\images\\";
			String fileName = "public-" + userToDelete + ".jpg";
			File file = new File(filePath + fileName);
			if(file.delete()){	
				Statement st = con.createStatement();
				st.executeUpdate("update catphotos set public='n' where uname = '" + userToDelete + "'");
				st.close();
				message = "The public cat picture of " + userToDelete + " was deleted.";
			}else{
				message = "Error deleting public cat picture from " + userToDelete + ".";
			}			
		}
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
				<%
				    if (message != null) {
					%>
						<h2><%= message %></h2>
					<%
					}
				%>
				<h2>Members Public Cat Pictures</h2>

				<%
				Statement st2 = con.createStatement();
				ResultSet rs1 = st2.executeQuery("select CL.uname from catlovers CL, catphotos CP where CL.uname = CP.uname and CP.public = 'y'");
				while (rs1.next()) {
					String user = rs1.getString("uname");
					%>
					<h3><%= user %>
					<img src="<%= request.getContextPath() %>/protected/images/public-<% out.print(user); %>.jpg"/>
					<br/>
					<a href="<%= request.getContextPath() %>/protected/admin/viewPhotos.jsp?action=delete&user=<%= user %>">Delete this cat image</a>
					<br/><br/>
				<%
				}
				%>

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
con.close();
%>
<%
	} else {		
%>
<h2> YOU DO NOT HAVE AUTHORIZATION TO ACCESS THIS PAGE. </h2>
<%
	}
%>