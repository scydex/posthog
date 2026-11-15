import { useValues } from 'kea'

import { LemonCard } from '@posthog/lemon-ui'

import { HedgehogMailbox } from '../../Channels/EmailDomain/hoggies'
import { SendFromCodeSurface, firstCodeSendLogic } from './firstCodeSendLogic'
import { FirstSendStatus } from './FirstSendStatus'
import { SendFromCodeSnippet } from './SendFromCodeSnippet'
import { VerifiedSender } from './sendingDomain'

export function SendFromCodeNextCard({
    surface,
    eyebrow,
    sender,
}: {
    surface: SendFromCodeSurface
    eyebrow: string
    sender: VerifiedSender
}): JSX.Element {
    const { firstCodeSend } = useValues(firstCodeSendLogic({ surface }))

    return (
        <LemonCard
            hoverEffect={false}
            className="rounded-xl border-accent bg-accent-highlight-secondary p-6 @md:p-8 flex flex-col gap-5"
            data-attr="send-from-code-next-card"
        >
            <div className="flex items-start gap-4">
                <HedgehogMailbox className="w-20 shrink-0" />
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs uppercase tracking-wide text-secondary">{eyebrow}</span>
                    <h2 className="m-0 text-xl font-semibold">Send email from your code</h2>
                    <p className="m-0 text-sm text-secondary">
                        <span>One API call from your server sends a sign-in code, a receipt or a password reset</span>
                        <span>
                            {' from '}
                            <span className="font-mono break-words">{sender.email}</span>
                        </span>
                        <span>. PostHog links every email to the person who got it.</span>
                    </p>
                </div>
            </div>
            {firstCodeSend.status === 'arrived' ? null : (
                <div className="rounded-lg border bg-surface-primary p-4">
                    <SendFromCodeSnippet from={sender.from} surface={surface} />
                </div>
            )}
            <FirstSendStatus surface={surface} />
        </LemonCard>
    )
}
