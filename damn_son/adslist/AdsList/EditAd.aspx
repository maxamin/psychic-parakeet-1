<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EditAd.aspx.cs" Inherits="AdsList.EditAd" validateRequest="false" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <div>
        <%# EditedAd.Text %>
    </div>
    <p>Update Text:</p>
    <asp:TextBox Text="<%# EditedAd.Text %>" runat="server" ID="AdTextUpdate" TextMode="MultiLine" Columns="5" Enabled="<%# EditedAd.Status != AdsList.Models.ReviewStatus.InReview %>">
    </asp:TextBox>
    <asp:Button runat="server" ID="UpdateBtn" OnClick="Update" Text="Update" Enabled="<%# EditedAd.Status != AdsList.Models.ReviewStatus.InReview %>"/>
    <p>Updating the text will set the status of the ad to Unapproved!</p>
    <p>You cannot edit while the ad is in review.</p>
</asp:Content>
