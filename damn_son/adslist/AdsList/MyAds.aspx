<%@ Page Title="My Ads" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="MyAds.aspx.cs" Inherits="AdsList.MyAds" %>
<%@ Register TagPrefix="uc" TagName="AdList" Src="~/AdList.ascx" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
 
    <uc:AdList id="MyAdsList" runat="server" ShowSelector="false" QueryName="myads"></uc:AdList>

</asp:Content>