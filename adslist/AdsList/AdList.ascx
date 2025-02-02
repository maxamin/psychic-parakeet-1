<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AdList.ascx.cs" Inherits="AdsList.AdList" %>
<!-- Query Selector -->
<asp:Repeater ID="QuerySelector" runat="server" Visible="<%# ShowSelector %>">
    <ItemTemplate>
        <a href='<%# DataBinder.Eval(Container.DataItem, "QueryName", "?AdQuery={0}") %>'><%# DataBinder.Eval(Container.DataItem, "DisplayName") %></a>
    </ItemTemplate>
</asp:Repeater>
<!-- Ad List will display ads based on the QueryName attribute (low prio) or the AdQuery parameter (high prio) to allow bookmarking -->
<ul>
    <asp:ListView ID="AdListView"
        ItemType="AdsList.Models.Ad"
        runat="server"
        SelectMethod="GetAds">
        <ItemTemplate>
            <li><%#: previewText(Item) %> (Posted: <%#: Item.CreatorUser %>; Approved: <%#: Item.Approved %>; Status: <%#: Item.Status %>)
                <asp:HyperLink runat="server" NavigateUrl='<%# Eval( "Id", "/Admin/Review.aspx?id={0}") %>' Visible="<%# IsApprover && Item.Status == AdsList.Models.ReviewStatus.WaitingForReview %>">Review</asp:HyperLink>
                <asp:HyperLink runat="server" NavigateUrl='<%# Eval( "Id", "/EditAd.aspx?id={0}") %>' Visible="<%# IsApprover || Item.CreatorUser == HttpContext.Current.User.Identity.Name && Item.Status != AdsList.Models.ReviewStatus.InReview %>">Edit</asp:HyperLink>
                <asp:HyperLink runat="server" NavigateUrl='<%# Eval( "Id", "/PublishAd.aspx?id={0}") %>' Visible="<%# Item.Approved == true %>">Publish</asp:HyperLink>
            </li>
        </ItemTemplate>
    </asp:ListView>
</ul>
