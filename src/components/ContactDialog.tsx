'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import styles from './ContactDialog.module.css'

const accessKey = '1bb07ad5-702b-489a-951b-dfe12c94290a'
const captchaSiteKey = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'
const captchaScript = 'https://js.hcaptcha.com/1/api.js?onload=contactCaptchaReady&render=explicit&recaptchacompat=off'

type CaptchaApi = {
  render: (element: HTMLElement, options: {
    sitekey: string
    size: 'invisible'
    callback: (token: string) => void
    'error-callback': () => void
    'expired-callback': () => void
  }) => string | number
  execute: (widgetId: string | number) => void
  reset: (widgetId: string | number) => void
}

declare global {
  interface Window {
    hcaptcha?: CaptchaApi
    contactCaptchaReady?: () => void
  }
}

type ContactDialogProps = {
  id: string
  email: string
  className?: string
  label: string
}

export function ContactDialog({ id, email, className, label }: ContactDialogProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<string | number | null>(null)
  const pendingFormRef = useRef<HTMLFormElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'sending' | 'success' | 'error'>('idle')
  const [captchaError, setCaptchaError] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    nameRef.current?.focus()

    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeDialog()
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || widgetRef.current !== null) return

    let cancelled = false
    const renderCaptcha = () => {
      if (cancelled || !window.hcaptcha || !captchaRef.current || widgetRef.current !== null) return
      widgetRef.current = window.hcaptcha.render(captchaRef.current, {
        sitekey: captchaSiteKey,
        size: 'invisible',
        callback: (token) => {
          const form = pendingFormRef.current
          pendingFormRef.current = null
          if (form) void sendMessage(form, token)
        },
        'error-callback': () => {
          pendingFormRef.current = null
          setCaptchaError(true)
          setStatus('idle')
        },
        'expired-callback': () => {
          pendingFormRef.current = null
          setStatus('idle')
        },
      })
      setCaptchaReady(true)
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${captchaScript}"]`)
    if (script?.dataset.ready === 'true') {
      renderCaptcha()
    } else {
      window.contactCaptchaReady = () => {
        if (script) script.dataset.ready = 'true'
        renderCaptcha()
      }
      if (!script) {
        script = document.createElement('script')
        script.src = captchaScript
        script.async = true
        script.addEventListener('error', () => {
          script?.remove()
          setCaptchaError(true)
        }, { once: true })
        document.head.appendChild(script)
      }
    }

    return () => { cancelled = true }
  }, [isOpen])

  function openDialog() {
    setStatus('idle')
    setCaptchaError(false)
    setIsOpen(true)
  }

  function closeDialog() {
    pendingFormRef.current = null
    if (widgetRef.current !== null) window.hcaptcha?.reset(widgetRef.current)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'verifying' || status === 'sending') return
    if (widgetRef.current === null || !window.hcaptcha) {
      setCaptchaError(true)
      return
    }
    setCaptchaError(false)
    setStatus('verifying')
    pendingFormRef.current = event.currentTarget
    window.hcaptcha.execute(widgetRef.current)
  }

  async function sendMessage(form: HTMLFormElement, token: string) {
    const formData = new FormData(form)
    formData.set('access_key', accessKey)
    formData.set('h-captcha-response', token)
    setStatus('sending')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data: { success?: boolean } = await response.json()
      if (!response.ok || !data.success) throw new Error('Submission failed')
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      if (widgetRef.current !== null) window.hcaptcha?.reset(widgetRef.current)
    }
  }

  function trapTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !panelRef.current) return
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'))
      .filter((element) => element.offsetParent !== null && element.tabIndex >= 0)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <button ref={triggerRef} className={className} type='button' onClick={openDialog}>
        {label} <span aria-hidden='true'>↗</span>
      </button>
      <div className={styles.overlay} hidden={!isOpen}>
        <div className={styles.backdrop} onClick={closeDialog} aria-hidden='true' />
        <div
          ref={panelRef}
          className={styles.dialog}
          role='dialog'
          aria-modal='true'
          aria-labelledby={`${id}-title`}
          onKeyDown={trapTab}
        >
          <div className={styles.content}>
            <button className={styles.close} type='button' onClick={closeDialog} aria-label='Close contact form'>×</button>
            <p className={styles.eyebrow}>Contact</p>
            <h2 id={`${id}-title`}>Let&apos;s talk.</h2>
            <p className={styles.intro}>Tell me a little about what you have in mind.</p>
            <p className={styles.success} role='status' hidden={status !== 'success'}>Thanks for reaching out. Your message has been sent.</p>
            <form className={styles.form} onSubmit={onSubmit} hidden={status === 'success'}>
              <label htmlFor={`${id}-name`}>Name</label>
              <input ref={nameRef} id={`${id}-name`} name='name' type='text' autoComplete='name' required />
              <label htmlFor={`${id}-email`}>Email</label>
              <input id={`${id}-email`} name='email' type='email' autoComplete='email' required />
              <label htmlFor={`${id}-message`}>Message</label>
              <textarea id={`${id}-message`} name='message' rows={5} required />
              <input className={styles.honeypot} type='checkbox' name='botcheck' tabIndex={-1} autoComplete='off' aria-hidden='true' />
              <div className={styles.captcha} ref={captchaRef} />
              {captchaError && <p className={styles.error} role='alert'>Verification could not load. Please email me instead.</p>}
              {status === 'error' && <p className={styles.error} role='alert'>Your message could not be sent. Please try again or email me directly.</p>}
              <button className={styles.submit} type='submit' disabled={!captchaReady || status === 'verifying' || status === 'sending'}>
                {status === 'verifying' ? 'Checking…' : status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden='true'>↗</span>
              </button>
              <p className={styles.captchaNotice}>Protected by hCaptcha. <a href='https://www.hcaptcha.com/privacy' target='_blank' rel='noopener noreferrer'>Privacy</a> · <a href='https://www.hcaptcha.com/terms' target='_blank' rel='noopener noreferrer'>Terms</a></p>
            </form>
            <p className={styles.fallback}>Prefer email? <a href={`mailto:${email}`}>{email}</a></p>
          </div>
        </div>
      </div>
    </>
  )
}
