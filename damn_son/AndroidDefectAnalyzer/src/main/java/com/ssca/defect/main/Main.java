
package com.ssca.defect.main;

import java.io.File;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import com.ssca.defect.analyse.AnalyserController;
import com.ssca.defect.commonData.CommonData;
import com.ssca.defect.decompile.Apktool;

/**
 * @author yujianbo
 *
 * 2016年1月21日
 */
public class Main {


	public static void main(String[] args) {
		//main传参
		new Scheduler().mainScheduler("/Users/yujianbo/Desktop/tmp/apk/test.apk", null);

	}

}

class Task implements Runnable{
	private String apkPath;
	public Task(String apkPath){
		this.apkPath=apkPath;
	}
	@Override
	public void run() {
		new Scheduler().mainScheduler(apkPath, null);
	}
}

class Server{
	private ThreadPoolExecutor executor;
	public Server(){
		executor = (ThreadPoolExecutor)Executors.newCachedThreadPool();
	}
	public void executeTask(Task task){
		executor.execute(task);
	}
	public void endServer(){
		executor.shutdown();
	}
}
