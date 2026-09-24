<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

class EmailHelper {
    public static function sendEmail($to, $subject, $body) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'medsyncuwu@gmail.com';
            $mail->Password   = 'xyhj xuli ymnm dqme';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            $mail->setFrom('medsyncuwu@gmail.com', 'UWU MedSync');
            $mail->addAddress($to);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Wrap content inside a standardized, card-based email template.
     */
    public static function wrapCard($heading, $recipientName, $mainTextHtml, $boxHtml = '', $secondaryTextHtml = '', $headingColor = '#0d6efd') {
        $recipientGreeting = !empty($recipientName) ? "Dear <strong>" . htmlspecialchars($recipientName) . "</strong>," : "Hello,";
        $currentYear = date('Y');

        return "
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;\">
            <div style=\"text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;\">
                <h2 style=\"color: #0d6efd; margin: 0; font-size: 22px;\">UWU MedSync</h2>
                <p style=\"color: #6c757d; font-size: 14px; margin: 5px 0 0 0;\">Medical Center Management System</p>
            </div>
            <div style=\"padding: 25px 0;\">
                <h3 style=\"color: {$headingColor}; margin-top: 0; font-size: 18px;\">{$heading}</h3>
                <p style=\"color: #333333; font-size: 15px; line-height: 1.6; margin-bottom: 15px;\">{$recipientGreeting}</p>
                <div style=\"color: #555555; font-size: 14px; line-height: 1.6;\">
                    {$mainTextHtml}
                </div>
                {$boxHtml}
                <div style=\"color: #555555; font-size: 14px; line-height: 1.6;\">
                    {$secondaryTextHtml}
                </div>
            </div>
            <div style=\"border-top: 1px solid #f0f0f0; padding-top: 15px; text-align: center; color: #888888; font-size: 12px;\">
                <p style=\"margin: 0;\">&copy; {$currentYear} UWU MedSync. All rights reserved.</p>
                <p style=\"margin: 4px 0 0 0;\">Uva Wellassa University Medical Center</p>
            </div>
        </div>";
    }

    /**
     * Create a highlighted box for OTP display.
     */
    public static function createOtpBox($otp, $expiryMinutes = 15) {
        return "
        <div style=\"background-color: #f0f7ff; border-left: 4px solid #0d6efd; padding: 18px 20px; margin: 20px 0; border-radius: 6px; text-align: center;\">
            <div style=\"font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0d6efd; font-family: monospace;\">{$otp}</div>
            <p style=\"margin: 8px 0 0 0; color: #6c757d; font-size: 13px;\">This code will expire in {$expiryMinutes} minutes.</p>
        </div>";
    }

    /**
     * Create a notification/callout box (e.g. Warning, Notice, Info).
     */
    public static function createNoticeBox($noticeText, $title = 'Notice:', $borderColor = '#ffc107', $bgColor = '#fff3cd', $textColor = '#856404') {
        return "
        <div style=\"background-color: {$bgColor}; border-left: 4px solid {$borderColor}; padding: 12px 15px; margin: 20px 0; border-radius: 4px;\">
            <p style=\"margin: 0; color: {$textColor}; font-size: 14px; line-height: 1.5;\">
                " . ($title ? "<strong>{$title}</strong> " : "") . "{$noticeText}
            </p>
        </div>";
    }

    /**
     * Create a clean key-value table box (e.g. for appointment details).
     */
    public static function createInfoTableBox($rows, $borderColor = '#198754', $bgColor = '#f0fdf4') {
        $tableRows = '';
        foreach ($rows as $label => $val) {
            $tableRows .= "
            <tr>
                <td style=\"padding: 6px 0; color: #6c757d; width: 40%; font-size: 14px;\">{$label}:</td>
                <td style=\"padding: 6px 0; font-weight: bold; color: #333333; font-size: 14px;\">{$val}</td>
            </tr>";
        }
        return "
        <div style=\"background-color: {$bgColor}; border-left: 4px solid {$borderColor}; padding: 15px 20px; margin: 20px 0; border-radius: 6px;\">
            <table style=\"width: 100%; border-collapse: collapse;\">
                {$tableRows}
            </table>
        </div>";
    }
}
?>