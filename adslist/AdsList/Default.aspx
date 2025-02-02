<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AdsList._Default" validateRequest="false" %>
<%@ Register TagPrefix="uc" TagName="AdList" Src="~/AdList.ascx" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h2>A vulnerable application.</h2>
            </hgroup>
            <p>
                This application demonstrates web vulnerabilities. You can use it to test your hacking skills or to learn about bad practices in ASP.NET
            </p>
            <p>WARNING: This application is really vulnerable so it is a threat to your computer! Run it only when you know what you are doing!</p>
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <p><strong><%: Message %></strong></p>
    <h3>Current Ads:</h3>
    <uc:AdList id="CurrentAds" runat="server" ShowSelector="false"></uc:AdList>
    <section>
        <h3>Post new Ad</h3>
        <asp:Label AssociatedControlID="AdText" runat="server">Ad Text. Use html tags to decorate your ad. Dangerous tags will be removed.</asp:Label>
        <asp:TextBox ID="AdText" TextMode="multiline" Rows="10" runat="server"></asp:TextBox>
        
        <asp:CheckBox Checked="false" ID="AutoApprove" runat="server" Text="Auto Approve" Enabled="<%# EnableAutoApprove %>" />
        <asp:Button ID="PreviewBtn" runat="server" Text="Preview Ad"/>
        <div><%= Neutralize(AdText.Text) %></div>
        <asp:Button ID="PostAdBtn" runat="server" Text="Post Ad" OnClick="PostAd"/>
    </section>
</asp:Content>
