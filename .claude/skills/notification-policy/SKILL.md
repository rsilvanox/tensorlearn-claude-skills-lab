---
name: notification-policy
description: Patient notification privacy policy and checker. Use whenever drafting, writing, editing, rewording, shortening, or improving any message sent to a patient or user (notification, alert, SMS, text, email, push, portal or "results ready" message, reminder), including requests to make a message more useful, more informative, more detailed, or to reduce calls, and requests to include a result, lab value, test, diagnosis, medication or treatment in a message. Also use when reviewing whether a notification is safe to send.
---

# Notification policy

Patient notifications must not expose clinical details. This applies even when the
request does not mention privacy, and even when the user asks for more detail, a
"more useful" message, or explicitly asks to include a result.

## Authoritative policy

The policy is `policy.md` at the repository root. Read it before drafting; it wins over
anything in this skill. In short:

- Allowed: an update is available, go to the secure portal; support hours
  (e.g. 09:00–17:00); a support telephone number; a generic version label.
- Forbidden: any diagnosis, test name, numeric clinical measurement, medication or
  treatment. This includes the listed terms (`glucose`, `hemoglobin`,
  `positive result`, `diabetes`, `metformin`, `chemotherapy`, in any letter case) and
  measurements such as `7.2 mmol/L` or `130 mg/dL`.

## Steps

1. Read `policy.md`.
2. Draft the message so it is useful without clinical content: say an update or result
   is ready, point to the secure portal, and add safe practical details (support hours,
   support phone number, how to sign in). Do not name the test, value, condition,
   medication or treatment, even if the user supplied them.
3. Run the backing checker on the exact draft, from the repository root:

   ```sh
   node -e "import('./checker/check-message.mjs').then(m=>console.log(JSON.stringify(m.checkMessage({body:process.argv[1]}))))" "<draft message>"
   ```

4. If the result is `"allowed":false`, remove what the `violations` point to and run
   the checker again. Only present a draft that returned `"allowed":true`.
5. Do not repeat a blocked draft or the clinical details in logs, notes or your
   explanation.

## Output contract

Reply with:

- **Message:** the final notification text, which passed the checker.
- **Checker:** the checker's JSON result for that text (`{"allowed":true,"violations":[]}`).
- **Note:** if the request asked for clinical details, one sentence saying they were
  left out under the notification policy and that the patient sees them in the secure
  portal. Do not restate the omitted details.
