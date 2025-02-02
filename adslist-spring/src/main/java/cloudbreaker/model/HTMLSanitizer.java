package cloudbreaker.model;

import java.util.regex.Pattern;

public class HTMLSanitizer {

	private static final Pattern[] deleteRules = {
			Pattern.compile("(?i)<script>"),
			Pattern.compile("(?i)<form>"),
			Pattern.compile("(?i)<object>"),
			Pattern.compile("(?i)<applet>"),
			Pattern.compile("(?i)<style>"),
			Pattern.compile("(?i)onload"),
			Pattern.compile("(?i)onerror"),
			Pattern.compile("(?i)onsubmit"),
			Pattern.compile("(?i)onclick"),
			Pattern.compile("(?i)onmouseover"),
			Pattern.compile("(?i)onmouseout"),
			Pattern.compile("(?i)onchange"),
			Pattern.compile("(?i)onkeypress"),
			Pattern.compile("(?i)onkeydown"),
			Pattern.compile("(?i)onkeyup")
	};
	
	public static String sanitize(String input) {
		String retval = input;
		for (Pattern rule : deleteRules) {
			retval = rule.matcher(retval).replaceAll("");
		}
		return retval;
	}
}
