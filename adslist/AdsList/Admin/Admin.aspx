<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Admin.aspx.cs" Inherits="AdsList.Admin.Admin" %>

<%@ Register TagPrefix="uc" TagName="AdList" Src="~/AdList.ascx" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <!--Your roles: admin: <%= User.IsInRole("admin") %>, approver:  <%= User.IsInRole("approver") %>-->
    <div>
        <uc:AdList ID="AdsToApprove" runat="server" ShowSelector="true"></uc:AdList>
    </div>
</asp:Content>
