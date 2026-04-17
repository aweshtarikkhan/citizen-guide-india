/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ email, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your new email address for Matdaan</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm Your New Email Address</Heading>
        <Text style={text}>
          You requested to change your email on Matdaan.com from{' '}
          <Link href={`mailto:${email}`} style={inlineLink}>{email}</Link>{' '}to{' '}
          <Link href={`mailto:${newEmail}`} style={inlineLink}>{newEmail}</Link>. Please confirm the change by clicking the link below.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account immediately.
          <br />
          Visit us at{' '}
          <Link href="https://www.matdaan.com" style={link}>www.matdaan.com</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 25px' }
const inlineLink = { color: 'inherit', textDecoration: 'underline' }
const link = { color: '#000000', textDecoration: 'underline', fontWeight: 'bold' as const }
const button = { backgroundColor: '#000000', color: '#ffffff', fontSize: '14px', borderRadius: '8px', padding: '12px 20px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', lineHeight: '1.6' }
