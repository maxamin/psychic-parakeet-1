<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Review.aspx.cs" Inherits="AdsList.Admin.Review" validateRequest="false" %>

<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <p>Ad Text</p>
    <div>
        <%# EditedAd.Text %>
    </div>
    <p>User: <%#: EditedAd.CreatorUser %></p>
    <asp:Button runat="server" ID="ApproveBtn" OnClick="Approve" Text="Approve" />
    <asp:Button runat="server" ID="RejectBtn" OnClick="Reject" Text="Reject" />
    <hr/>
    <p>Update text:</p>
    <asp:TextBox Text="<%# EditedAd.Text %>" runat="server" ID="AdTextUpdate" TextMode="MultiLine" Columns="5">
    </asp:TextBox>
    <asp:Button runat="server" ID="UpdateBtn" OnClick="Update" Text="Update" />
</asp:Content>
