<?
/*********************************************************/
/*********************************************************/
/**														**/
/**				Kontakte Version 1.0					**/
/**				Datum: 01.10.2008						**/
/**				File: send.php							**/
/**														**/
/*********************************************************/
/*********************************************************/



foreach ($_REQUEST as $k => $v) {
 	$$k = $v;
 }


$mailto="carsten.lau@wiesental.net";	




foreach ($_POST as $key=>$value) { 
	if ($key=="mailfrom") {
    	$mailfrom = utf8_decode($value);
	} else if($key=="subject") { 
    	$subject = utf8_decode($value);
    } else {
	    $message .= $key.": $value\n";
    }
}                  

$message = utf8_decode($message);

$headers .= "From: ".$mailfrom."\n";

if (($mailfrom<>'') AND ($chck=='js')){
	print "test";
	mail($mailto, "Roadhouse Kontaktformular: ".$subject, $message,$headers);
} else {
	print "spam not allowed";
}

?>
