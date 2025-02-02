<%@ page import ="java.sql.*" %>
<%@ page import="java.io.*" %>" 
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
<script>
function ActionDeterminator() {
  var selItem = document.getElementById("fileAccessSelect")
  var selValue = selItem.options[selItem.selectedIndex].value;	
  if(selValue == "public") {
	document.getElementById("fm1").action = "fileupload.jsp";
  }
  if(selValue == "private") {
	document.getElementById("fm1").action = "private-fileupload.jsp";
  }
  document.getElementById("fm1").submit();
}
</script>
<title>Private area</title>
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
					String message = request.getParameter("message");
					if (message != null) {
						if (!message.isEmpty()) {
						%>
						<h2><%= message %></h2>
						<%
						}
					}
					String user = request.getParameter("user");
					String action = request.getParameter("action");
					String source = request.getParameter("source");
					Boolean deleteError = false;
					Class.forName("com.mysql.jdbc.Driver");
					Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
					if (action == null || source == null || user == null) {
						deleteError = true;
					} else if (action.isEmpty() || source.isEmpty() || user.isEmpty()) {
						deleteError = true;
					} else if (!action.equals("delete")) {
						deleteError = true;
					} else if (source.equals("public") || source.equals("private")) {
						String filePath = "C:\\Users\\leggosgirl\\Tools\\apache-tomcat-7.0.63\\webapps\\overpoweringly-cute-cats\\protected\\images\\";
						String fileName = source + "-" + user + ".jpg";
						File file = new File(filePath + fileName);
						if(file.delete()){	
							Statement st = con.createStatement();
							st.executeUpdate("update catphotos set " + source + "='n' where uname = '" + user + "'");
							st.close();
							%>
							<h2> Your <%= source %> cat picture was deleted. </h2>
							<%
						}else{
							%>
							<h2> Error deleting your <%= source %> cat picture. </h2>
							<%
						}			
					}
				
					Statement st2 = con.createStatement();
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
									<dt>Click to delete: </dt>
									<dd><a href="<%= request.getContextPath() %>/protected/myCatPhotos.jsp?action=delete&source=private&user=<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>">Delete private cat image</a></dd>
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
								<dd><img src="<%= request.getContextPath() %>/protected/images/public-<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>.jpg"/></dd>	<dt>Click to delete: </dt>
								<dd><a href="<%= request.getContextPath() %>/protected/myCatPhotos.jsp?action=delete&source=public&user=<%= request.getRemoteUser()== null ? "null" : request.getRemoteUser() %>">Delete public cat image</a></dd>
							</dl>
						<%
						} else {
						%>
							<h2> You haven't uplaoded a public cute cat yet!  Do so below.  </h2>
						<%
						}
						if (privatePic.equals("n") || publicPic.equals("n")) {
						%>
						<form id="fm1" action="fileupload.jsp" method="post" enctype="multipart/form-data">
							<section class="row">
								<label>Select private or public</label>
								<select id="fileAccessSelect" name="fileAccess">
									<% 
									if (privatePic.equals("n")) {
										%>
										<option value="private">private</option>
										<%
									}
									if (publicPic.equals("n")) {
										%>
										<option value="public">public</option>
										<%
									}
									%>
								</select>
							</section>
							<section class="row">
								<label>Select picture to uplaod </label>
								<input type="file" name="file" size="50" />
							</section>
							<section class="row btn-row">
								<input type="hidden" name="redirect" value="<%= request.getContextPath() %>/protected/myCatPhotos.jsp"/>
								<input type="submit" value="Submit" onClick="ActionDeterminator();" />
								<input type="reset" value="Reset" />
							</section>
						</form>
						<%
						}
					}
					st2.close();
					%>
							<h3>What do you want to do?</h3>
				<dl>
					<dt>Upload  </dt>
					<dd><a href="<%= request.getContextPath() %>/protected/myCatPhotos.jsp">new private and public cat pictures </a></dd>
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
  con.close();
  
  
 %>