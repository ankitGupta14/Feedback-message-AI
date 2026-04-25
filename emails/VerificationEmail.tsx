import {
  Html,
  Head,
  Font,
  Preview,
  Row,
  Heading,
  Section,
  Text,
  Container,
  Img,
  Hr,
} from "@react-email/components";

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
        <title>Verification Code</title>
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

      <Preview>Your Feedback Mystery verification code: {otp} 🚀</Preview>

      {/* Outer Background */}
      <Section style={{ backgroundColor: "#0f0f1a", padding: "40px 0" }}>
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#1a1a2e",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #2d2d4e",
          }}
        >
          {/* Header */}
          <Section
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              padding: "32px 40px",
              textAlign: "center",
            }}
          >
            <Heading
              as="h1"
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "800",
                margin: "0",
                letterSpacing: "-0.5px",
              }}
            >
              🔐 Feedback Mystery
            </Heading>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                margin: "8px 0 0",
              }}
            >
              Email Verification
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: "40px" }}>
            <Row>
              <Heading
                as="h2"
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 16px",
                }}
              >
                Hello, {username}! 👋
              </Heading>
            </Row>

            <Row>
              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  margin: "0 0 32px",
                }}
              >
                Thank you for signing up on{" "}
                <strong style={{ color: "#a78bfa" }}>Feedback Mystery</strong>.
                Use the verification code below to complete your registration.
              </Text>
            </Row>

            {/* OTP Box */}
            <Row>
              <Section
                style={{
                  background: "linear-gradient(135deg, #7c3aed22, #db277722)",
                  border: "1px solid #7c3aed55",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  margin: "0 0 32px",
                }}
              >
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    margin: "0 0 12px",
                  }}
                >
                  Your Verification Code
                </Text>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "48px",
                    fontWeight: "900",
                    letterSpacing: "12px",
                    margin: "0",
                    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {otp}
                </Text>
                <Text
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    margin: "12px 0 0",
                  }}
                >
                  ⏱ Expires in 1 hour
                </Text>
              </Section>
            </Row>

            {/* Warning */}
            <Row>
              <Section
                style={{
                  backgroundColor: "#fbbf2411",
                  border: "1px solid #fbbf2433",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  margin: "0 0 24px",
                }}
              >
                <Text
                  style={{
                    color: "#fbbf24",
                    fontSize: "13px",
                    margin: "0",
                  }}
                >
                  ⚠️ If you did not request this, please ignore this email.
                </Text>
              </Section>
            </Row>

            <Hr style={{ borderColor: "#2d2d4e", margin: "0 0 24px" }} />

            <Row>
              <Text
                style={{
                  color: "#4b5563",
                  fontSize: "12px",
                  textAlign: "center",
                  margin: "0",
                }}
              >
                © 2024 Feedback Mystery. All rights reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}