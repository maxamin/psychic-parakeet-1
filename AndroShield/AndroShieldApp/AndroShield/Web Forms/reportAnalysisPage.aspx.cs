﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Types;
using APKInfoExtraction;
using TaintAnalysis;
using System.Threading;
using System.Web.UI.HtmlControls;
using System.Drawing;

namespace AndroApp.Web_Forms
{
    public partial class reportAnalysisPage : System.Web.UI.Page
    {
        HashSet<int> expanded;
        protected void Page_Load(object sender, EventArgs e)
        {
            userEmail.Text = Session["username"].ToString();
            if(IsPostBack)
            {
                buildVulnerabilitiesTable();
            }
            if (!IsPostBack)
            {
                expanded = new HashSet<int>();
                Session["expanded"] = expanded;


                if ((Session["reportID"]!=null || Session["reportID"].ToString()!=""))
                {
                    Session["analysisReport"] = reportTable.findReportByID(int.Parse(Session["reportID"].ToString()));
                    Session["AnalysisReportApk"] = ((reportTable)Session["analysisReport"]).getApkOfThisReport();
                    Session["AnalysisReportPermissions"] = ((reportTable)Session["analysisReport"]).getPermissionsofThisReport();
                    Session["AnalysisReportVulnerabilities"] = ((reportTable)Session["analysisReport"]).getVulnerabilitiesOfThisReport();

                    apkNameValue.Text = Session["currentReportName"].ToString();

                    apkRiskValue.Text = (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).apkRiskLevel*100).ToString()+"%";
                    if(((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).apkRiskLevel<=0.4)
                    {
                        apkRiskValue.Text = "Low Risk";
                        apkRiskValue.CssClass = "lowRiskColor";
                    }
                    else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).apkRiskLevel <= 0.7)
                    {
                        apkRiskValue.Text = "Medium Risk";
                        apkRiskValue.CssClass = "mediumRiskColor";
                    }
                    else
                    {
                        apkRiskValue.Text = "High Risk";
                        apkRiskValue.CssClass = "highRiskColor";
                    }

                    apkVersionValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).versionName;
                    minSdkValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).minSDK;
                    targetSdkValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).targetSDK;
                    if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).testOnly)
                        testOnlyValue.Text = "True";
                    else
                        testOnlyValue.Text = "False";
                    packageNameValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).packageName;
                    versionNoValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).versionCode;
                    versionNameValue.Text = ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).versionName;
                    if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).debuggable)
                        debugValue.Text = "True";
                    else
                        debugValue.Text = "False";
                    if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).backup)
                        backupValue.Text = "True";
                    else
                        backupValue.Text = "False";

                    supportedArchiValue.Text = "";
                    if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).all)
                        supportedArchiValue.Text += "All";
                    else
                    {
                        Boolean firstArchi = true;
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).armeabi)
                        {
                            supportedArchiValue.Text += "armeabi";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).armeabi)
                            supportedArchiValue.Text += ", armeabi";

                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).armeabi_v7a)
                        {
                            supportedArchiValue.Text += "armeabi_v7a";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).armeabi_v7a)
                            supportedArchiValue.Text += ", armeabi_v7a";
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).arm64_v8a)
                        {
                            supportedArchiValue.Text += "arm64_v8a";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).arm64_v8a)
                            supportedArchiValue.Text += ", arm64_v8a";
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).x86)
                        {
                            supportedArchiValue.Text += "x86";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).x86)
                            supportedArchiValue.Text += ", x86";
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).x86_64)
                        {
                            supportedArchiValue.Text += "x86_64";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).x86_64)
                            supportedArchiValue.Text += ", x86_64";
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).mips)
                        {
                            supportedArchiValue.Text += "mips";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).mips)
                            supportedArchiValue.Text += ", mips";
                        if (firstArchi && ((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).mips64)
                        {
                            supportedArchiValue.Text += "mips64";
                            firstArchi = false;
                        }
                        else if (((AndroApp.apkInfoTable)Session["AnalysisReportApk"]).mips64)
                            supportedArchiValue.Text += ", mips64";


                        Session.Contents.Remove("AnalysisReportApk");
                    }

                    TableCell cell1 = new TableCell();
                    for (int i=0; i<((List<string>)Session["AnalysisReportPermissions"]).Count; i++)
                    {
                        TableRow row = new TableRow();
                        cell1.Text = ((List<string>)Session["AnalysisReportPermissions"])[i];
                        row.Cells.Add(cell1);
                        permissionsTable.Rows.Add(row);
                    }
                    Session.Contents.Remove("AnalysisReportPermissions");
                    buildVulnerabilitiesTable();
                }
            }
        }
        private void buildVulnerabilitiesTable(HashSet<int> expanded=null)
        {
            Button viewAllBtn;
            HtmlGenericControl descriptionWrapper;

            TableCell severity = new TableCell();
            TableCell category = new TableCell();
            TableCell type = new TableCell();
            TableCell info = new TableCell();
            TableCell viewAllBtnColumn = new TableCell();

            //Case 1: Apk with no vulnerabilities
            if (((List<List<string>>)Session["AnalysisReportVulnerabilities"]).Count == 0)
            {
                cleanApkDiv.Visible = true;
                vulnerabilityReportTable.Visible = false;
            }
            //Other cases:
            else
            {
                cleanApkDiv.Visible = false;
                vulnerabilityReportTable.Visible = true;

                for (int i = 0; i < ((List<List<string>>)Session["AnalysisReportVulnerabilities"]).Count; i++)
                {
                    TableRow row = new TableRow();

                    severity = new TableCell();
                    category = new TableCell();
                    type = new TableCell();
                    info = new TableCell();
                    viewAllBtnColumn = new TableCell();

                    viewAllBtn= new Button();
                    descriptionWrapper= new HtmlGenericControl();

                    if((float)Math.Round(double.Parse(((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][0]),2)<=0.4)
                    {
                        severity.Text = "Low";
                        severity.CssClass = "lowRiskColor";
                    }
                    else if((float)Math.Round(double.Parse(((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][0]), 2) <= 0.7)
                    {
                        severity.Text = "Medium";
                        severity.CssClass = "mediumRiskColor";
                    }
                    else
                    {
                        severity.Text = "High";
                        severity.CssClass = "highRiskColor";

                    }
                    //Session["severityValue"] = (float)Math.Round(double.Parse(((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][0]), 2);
                    //severity.Text = (float.Parse(Session["severityValue"].ToString())*100).ToString()+"%";
                    Session.Contents.Remove("severityValue");
                    category.Text = ((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][1];
                    type.Text = ((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][2];

                    descriptionWrapper = new System.Web.UI.HtmlControls.HtmlGenericControl("DIV");
                    descriptionWrapper.ID = "description" + "viewBtn" + i.ToString();
                    descriptionWrapper.Style.Add(HtmlTextWriterStyle.Width, "531px");
                    descriptionWrapper.Style.Add(HtmlTextWriterStyle.Height, "18px"); 
                    descriptionWrapper.Attributes.Add("CssClass", "descriptionWrapper");

                    Session["tempString"] = ((List<List<string>>)Session["AnalysisReportVulnerabilities"])[i][3].Replace("\r\n", "<br/>");
                    descriptionWrapper.InnerHtml = Session["tempString"].ToString();

                    Session.Remove("tempString");

                    if (expanded!=null && expanded.Contains(i))
                    {
                        descriptionWrapper.Style.Remove(HtmlTextWriterStyle.Overflow);
                        descriptionWrapper.Style.Add(HtmlTextWriterStyle.Height, "auto");
                        viewAllBtn.Style.Add(HtmlTextWriterStyle.Visibility, "hidden");
                    }
                    else
                    {
                        descriptionWrapper.Style.Add(HtmlTextWriterStyle.Overflow, "hidden");
                    }

                    info.Controls.Add(descriptionWrapper);

                    row.Cells.Add(severity);
                    row.Cells.Add(category);
                    row.Cells.Add(type);
                    row.Cells.Add(info);
                    row.CssClass = "vulnerabilityTableRow";

                    if(descriptionWrapper.InnerHtml.Length<60 && !descriptionWrapper.InnerHtml.Contains("<br/>"))
                        viewAllBtn.Visible = false;

                    viewAllBtn.ID = "viewBtn" + i.ToString();
                    viewAllBtn.Text = "View All";
                    viewAllBtn.CssClass = "homeButtons";
                    viewAllBtn.Click += new EventHandler(viewAllDel);
                    viewAllBtnColumn.Controls.Add(viewAllBtn);
                    viewAllBtnColumn.CssClass = "extraInfo";
                    row.Cells.Add(viewAllBtnColumn);

                    vulnerabilityReportTable.Rows.Add(row);
                }
            }
        }
        protected void viewAllDel(object sender, EventArgs e)
        {
            Button pressed = (Button)sender;
            String idNumber = pressed.ID.Substring(7);
            pressed.Text = "pressed";
            ((HashSet<int>)Session["expanded"]).Add(int.Parse(idNumber));
            for(int i=1; i<vulnerabilityReportTable.Rows.Count; i++)
            {
                vulnerabilityReportTable.Rows.RemoveAt(i);
                i--;
            }
            buildVulnerabilitiesTable((HashSet<int>)Session["expanded"]);
        }
        protected void signupNav_Click(object sender, EventArgs e)
        {
            Response.Redirect("userProfilePage.aspx");
        }
        protected void logoutButton_Click(object sender, EventArgs e)
        {
            Response.Cookies.Clear();
            Request.Cookies.Clear();

            Session.Abandon();
            Response.Redirect("homePage.aspx");
        }
        protected void newAnalysisBtn_Click(object sender, EventArgs e)
        {
            Response.Redirect("apkUploadPage.aspx",false);
        }

        protected void allReportsBtn_Click(object sender, EventArgs e)
        {
            Session["userReports"] = userAccountTable.getReportsOfThisUser(Session["username"].ToString());
            Response.Redirect("user'sReportsPage.aspx",false);
        }
    }
}