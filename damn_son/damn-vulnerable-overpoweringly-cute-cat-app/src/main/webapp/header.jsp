
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

			<header>
				<a id="logo" href="http://127.0.0.1:8080/overpoweringly-cute-cats/" title="go to damn vulnerable overpoweringly ute cat app">Cute Cats</a>
				<h1>My Cat Web Application (CAS Client)</h1>
				<h3>
				<% 
					if (request.getRemoteUser() != null) {
						out.println("<div class=\"authenticated\">");
						out.println("User: " + request.getRemoteUser());
						//Logout 
						out.println("&nbsp;&nbsp;");
						out.println("<a href=\"" + request.getContextPath() + "/loggedout.jsp\">Logout</a>");
						out.println("</div>");
					} else {
						out.println("Not logged in.");
					}
				%>
				</h3>
			</header>
			