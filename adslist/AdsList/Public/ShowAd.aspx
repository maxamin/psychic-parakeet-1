<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ShowAd.aspx.cs" Inherits="AdsList.Public.ShowAd" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <div>
        <%# DisplayedAd.Text %>
    </div>
</asp:Content>