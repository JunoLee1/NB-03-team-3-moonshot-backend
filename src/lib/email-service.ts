import nodemailer from "nodemailer";
import dotenv from "dotenv";

/**
 * 환경 변수 파일에 추가할 내용
 * email_service = 사용하려는 메일 서버 (gmail)
 * user = 이메일을 보내는 본인(서비스) 이메일
 * pass = user 이메일의 패스워드
 */
dotenv.config();

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587), // SMTP 이메일 전송 권장 포트
      secure: process.env.EMAIL_SECURE === "true", // 보안 SMTP 이메일 전송을 위한 권장 포트
      auth: {
        user: process.env.EMAIL_USER, // email 계정
        pass: process.env.EMAIL_PASS, // email 앱 비밀번호 또는 계정 비밀번호
      },
      tls: {
        rejectUnauthorized: false, // 서버의 tls 인증서의 유효성 검증 과정을 안하겠다는 의미(서비스 단계에서는 설정 변경 필요, MITM 공격에 취약), 로컬 개발 환경을 위한 설정
      },
    });
  }

  /**
   * 프로젝트 삭제 알림 이메일을 발송합니다.
   * @param projectName 삭제된 프로젝트 이름
   * @param recipients 이메일을 받을 멤버들의 이메일 주소 배열
   */
  async sendProjectDeletionNotice(projectName: string, recipients: string[]) {
    if (recipients.length === 0) {
      console.log("No recipients to notify for project deletion:", projectName);
      return;
    }

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`, // 보내는 사람 주소
      to: recipients.join(", "), // 받는 사람 목록 (콤마로 구분)
      subject: `[알림] 참여하신 '${projectName}' 프로젝트가 삭제되었습니다.`, // 이메일 제목
      text: `안녕하세요,\n\n참여하셨던 프로젝트 '${projectName}'이(가) 프로젝트 관리자에 의해 삭제되었음을 알려드립니다.\n\n감사합니다.\nYour App Team`, // Plain text 본문
      html: `<p>안녕하세요,</p><p>참여하셨던 프로젝트 <strong>'${projectName}'</strong>이(가) 프로젝트 관리자에 의해 삭제되었음을 알려드립니다.</p><p>감사합니다.<br/>Your App Team</p>`, // HTML 본문
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Project deletion email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending project deletion email:", error);
    }
  }

  // (필요 시) 다른 종류의 이메일 발송 메서드 추가 (예: 초대 이메일)
}

const emailService = new EmailService();
export default emailService;
