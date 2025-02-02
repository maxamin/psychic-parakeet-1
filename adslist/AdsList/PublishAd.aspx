<%@ Page Language="C#"  MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="PublishAd.aspx.cs" Inherits="AdsList.PublishAd" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <div>
        <%# PublishedAd.Text %>
    </div>
    <p>This ad is now shared and available under the following url: <a href="<%= GetUrl() %>"><%= GetUrl() %></a></p>
</asp:Content>
