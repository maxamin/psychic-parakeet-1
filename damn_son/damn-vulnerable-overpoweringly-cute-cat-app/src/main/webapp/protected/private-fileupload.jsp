<%@ page import ="java.sql.*" %>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<%@ page import="java.io.*,java.util.*, javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.apache.commons.io.output.*" %>
<%
	String userName = request.getRemoteUser();
	String fileAccess = "private";
	String redirect = request.getContextPath() + "/protected/myCatPhotos.jsp";
	String message = "File Uploaded!";

	File file ;
   int maxFileSize = 5000 * 1024;
   int maxMemSize = 5000 * 1024;
   String filePath = "C:\\Users\\leggosgirl\\Tools\\apache-tomcat-7.0.63\\webapps\\overpoweringly-cute-cats\\protected\\images\\";

   String contentType = request.getContentType();
   if ((contentType.indexOf("multipart/form-data") >= 0)) {

      DiskFileItemFactory factory = new DiskFileItemFactory();
      factory.setSizeThreshold(maxMemSize);
      factory.setRepository(new File("c:\\temp"));
      ServletFileUpload upload = new ServletFileUpload(factory);
      upload.setSizeMax( maxFileSize );
      try{ 
         List fileItems = upload.parseRequest(request);
         Iterator i = fileItems.iterator();
         while ( i.hasNext () ) 
         {
            FileItem fi = (FileItem)i.next();
            if ( !fi.isFormField () )  {
                String fieldName = fi.getFieldName();
                String fileName = fi.getName();
				int extension = fileName.toLowerCase().indexOf(".jpg");
				if (extension >= 0) {
					boolean isInMemory = fi.isInMemory();
					long sizeInBytes = fi.getSize();
					String newFileName = fileAccess + "-" + userName + fileName.substring(extension); 
					file = new File( filePath + newFileName) ;
					fi.write( file ) ;
					Class.forName("com.mysql.jdbc.Driver");
					Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/insecureCat", "catAdmin", "catPass");
					Statement st = con.createStatement();
					st.executeUpdate("update catphotos set " + fileAccess + "='y' where uname = '" + userName + "'");			
                } else {
					message = "Error: File must be a jpg";
				}
            }
         }
      }catch(Exception ex) {
         System.out.println(ex);
      }
   }else{
	 message = "Error:  File did not uplaod.";
   }
   String redirectURL = redirect + "?message=" + message;
   response.sendRedirect(redirectURL);
%>