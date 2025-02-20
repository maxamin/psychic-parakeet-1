﻿<%@ Page Title="" Language="C#" MasterPageFile="~/masterPage.Master" AutoEventWireup="true" CodeBehind="homePage.aspx.cs" Inherits="AndroApp.homepage" %>
<%@ MasterType VirtualPath="~/masterPage.Master" %> 
<asp:Content ID="headContent" ContentPlaceHolderID="head" runat="server">
        <script src="/JavaScript/jquery.js"></script>
    <script src="/JavaScript/JavaScript.js"></script>

</asp:Content>

<asp:Content ID="content1" ContentPlaceHolderID="navContentPlaceHolder" runat="server">
    <asp:Button ID="navSignUp" runat="server" Text="Sign Up" class="topRight topMenu lightText" CausesValidation="false" OnClick="navSignUp_Click"/>
</asp:Content>

<asp:Content ID="content" ContentPlaceHolderID="pageContent" runat="server">
    <asp:ScriptManager runat="server"></asp:ScriptManager>
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <div class="wrapper lightBackground">
                <div class="loginContainer">
                    <asp:RequiredFieldValidator ID="emailRequiredValidator" runat="server" ErrorMessage="*" ControlToValidate="emailTxt" SetFocusOnError="true" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator><label for="uname" class="boldText lightText negativeMargin">Email</label><asp:RegularExpressionValidator ID="emailValidator" CssClass="leftMargin" ControlToValidate="emailTxt" runat="server" ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" ErrorMessage="*Invalid" ForeColor="Red" SetFocusOnError="true" Display="Dynamic"></asp:RegularExpressionValidator><br />
                    <asp:TextBox ID="emailTxt" runat="server" TextMode="Email" placeholder="Enter Email" name="uname" class="loginInput"></asp:TextBox>

                    <asp:RequiredFieldValidator ID="passwordValidator" ControlToValidate="passwordTxt"  runat="server" ErrorMessage="*" ForeColor="Red" SetFocusOnError="true" Display="Dynamic"></asp:RequiredFieldValidator><label for="psw" class="boldText lightText negativeMargin">Password</label>
                    <asp:TextBox ID="passwordTxt" runat="server" TextMode="Password" placeholder="Enter Password" name="psw" class="loginInput"></asp:TextBox>
                    <label class="lightText loginInput">
                        <asp:CheckBox ID="rememberMeChck" runat="server" checked="true"  name="remember"/>Remember me
                    </label><br />

                    <asp:Button UseSubmitBehavior="true" ID="loginBtn" runat="server" Text="Login" class="homeButtons lightText boldText" OnClick="Button1_Click" />
                    <asp:LinkButton ID="fbButton"  class="homeButtons facebookLogin lightText boldText" CausesValidation="false" OnClick="fbButton_Click1" runat="server" OnClientClick="location.href='https://www.facebook.com/dialog/oauth?client_id=2277532892260615&response_type=code&scope=email&redirect_uri=https://localhost:44302/FB/facebookRedirect.aspx/';"  ><img src="../Images/fb_logo.jpg"/>Login with Facebook</asp:LinkButton><p class="lightText"><a href="signUpPage.aspx" class="homepageLink lightText">Don't have an account?</a></p>
                    <asp:Button ID="signupButton" CausesValidation="false" runat="server" Text="Sign Up"  class="homeButtons lightText boldText" OnClick="signupButton_Click" />
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>




