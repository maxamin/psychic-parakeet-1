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
<%
	String uName = request.getParameter("user");
	String writtenBy = request.getParameter("writtenBy");
	String comment = request.getParameter("comment");
	Boolean error = false;
	if (uName == null || writtenBy == null || comment == null) {
		error = true;
	}else if (uName.isEmpty() || writtenBy.isEmpty() || comment.isEmpty()) {
		error = true;
	}
	Class.forName("com.mysql.jdbc.Driver");
	Connection con1 = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
	if (!error) {
		Statement st1 = con1.createStatement();
		int i = st1.executeUpdate("insert into catcomments(uname, writtenBy, comment) values ('" + uName + "','" + writtenBy + "','" + comment  + "')");
		if (i > 0) {
		%>
				<h2>COMMENT ADDED</h2>
		<%
		}
		st1.close();
	}
%>			
				<h2>PROTECTED AREA</h2>

				<h2>Members Public Cat Pictures</h2>
				<%
					if (uName == null) {
						out.print("uName is null");
					} else if (!uName.isEmpty()) {
						Statement st2 = con1.createStatement();
						ResultSet rs1 = st2.executeQuery("select public from catphotos where uname = '" + uName + "'");
						if (rs1.next()) {
							String publicPic = rs1.getString("public");
							if (publicPic.equals("y")) {
							%>
								<img src="<%= request.getContextPath() %>/protected/images/public-<% out.print(uName); %>.jpg"/>
								<br/><br/>
							<%
							} else {
							%>
								<h2> <% out.print(uName); %> has no public cat photo </h2>
							<%
							}
						}
						st2.close();
				%>
						<h3> Comments </h3>						
					<%	
						Statement st = con1.createStatement();
						ResultSet rs = st.executeQuery("select comment, writtenBy from catcomments where uname = '" + uName +"'");
						while (rs.next()) {
							String printComment = rs.getString("comment");
							String printWrittenBy = rs.getString("writtenBy");
							%>
							<br/> Comment from <% out.print(printWrittenBy); %> : <% out.print(printComment); %>
							<%
						}
						st.close();
						%>
						<form id="fm1" method="post" action="otherMembersShow.jsp">
						    <section class="row">
								<label>Enter New Comment</label>
								<input type="text" name="comment" value="" />
							</section>
							<section class="row btn-row">
								<input type="hidden" name="writtenBy" value="<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>" />
								<input type="hidden" name="user" value="<% out.print(uName); %>" />
								<input type="submit" value="Submit" />
								<input type="reset" value="Reset" />
							</section>
						</form>
					<%
					}
					%>
				<br/><br/>
				
				<h3>What do you want to do?</h3>
				<dl>
					<dt>I need to </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/">See Overpoweringly Cute Cats</a></dd>
					<dt>See other and comment on other  </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/otherMembers.jsp">member's public cat pictures</a></dd>
					<dt>The cats are overpowing me take me: </dt>
					<dd><a href="<%= request.getContextPath() %>">back to other area</a></dd>
				</dl>
			</div>
		</div>
	</div>									
</body>
</html>
<%

con1.close();
%>