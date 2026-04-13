import {
  Html,
  Head,
  Font,
  Preview,
  Row,
  Heading,
  Section,
  Text,
  Button,
} from "@react-email/components";
import { url } from "zod/v4/mini";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KF0mCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here &apos; You are verification code: {otp} 🚀</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username}!</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for signing up. Your verification code is:{" "}
            <strong>{otp}</strong>. Please enter this code in the app to verify
            your account and complete the registration process.
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email. This
            code will expire in 10 minutes for security reasons.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
