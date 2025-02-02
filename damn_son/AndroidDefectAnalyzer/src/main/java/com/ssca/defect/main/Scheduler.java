/**
 * 
 */
package com.ssca.defect.main;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.ssca.defect.analyse.AnalyserController;
import com.ssca.defect.commonData.CommonData;
import com.ssca.defect.decompile.Apktool;

/**
 * @author yujianbo
 *
 * 2016年3月8日
 */
public class Scheduler {
	
	private static Logger logger = LogManager.getLogger(Scheduler.class);

	public void mainScheduler(String apkPath,String reportPath){
		if(!apkPath.endsWith(".apk")){
			return;
		}
		
		//设置共享数据
		CommonData.setApkPath(apkPath);
//		CommonData.setReportPath(reportPath);
		
		//预处理
	    Config.setWhiteList();
		
		
		//decomplie
		Apktool apktool = new Apktool();
		apktool.do_decompile();
		
		//analyse
		AnalyserController.do_analyse();
		
		//generate report
//		GenerateReport.WriteReport();
//		GenerateReport.WriteRedis();
		
//		System.out.println("Activity out："+CommonData.getActivityOutList());
//		System.out.println("Activity in ："+CommonData.getActivityInList());
//		logger.warn(apkPath+" Activity in ："+CommonData.getActivityInList());
		
//		System.out.println(CommonData.getServiceOutList());
//		System.out.println(CommonData.getReceiverOutList());
	}
}
