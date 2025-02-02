/**
 * 
 */
package com.ssca.defect.analyse;

import com.ssca.defect.analyse.manifest.ManifestAnalyser;
import com.ssca.defect.analyse.smali.SmaliAnalyzer;

/**
 * @author yujianbo
 *
 * 2016年1月21日
 */
public class AnalyserController {

	public static void do_analyse(){
		ManifestAnalyser manifestAnalyser = new ManifestAnalyser();
		manifestAnalyser.doAnalyse();
		
		SmaliAnalyzer smaliAnalyzer = new SmaliAnalyzer();
		smaliAnalyzer.doSmaliAnalyse();
		
		System.gc();
	}
}
