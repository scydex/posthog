import { useValues } from 'kea'

import { HedgehogMailbox } from '../../Channels/EmailDomain/hoggies'
import { SendFromCodeSurface, firstCodeSendLogic } from './firstCodeSendLogic'
import { FirstSendStatus } from './FirstSendStatus'
import { SendFromCodeSnippet } from './SendFromCodeSnippet'

export function SendFromCodeNextCard({
    surface,
    eyebrow,
    from,
    fromAddress,
}: {
    surface: SendFromCodeSurface
    eyebrow: string
    from: string | null
    fromAddress: string | null
}): JSX.Element {
    const { firstCodeSend } = useValues(firstCodeSendLogic({ surface }))

    return (
        <section
            className="rounded-xl border border-accent bg-accent-highlight-secondary p-6 @md:p-8 flex flex-col gap-5"
            data-attr="send-from-code-next-card"
        >
            <div className="flex items-start gap-4">
                <HedgehogMailbox className="w-20 shrink-0" />
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs uppercase tracking-wide text-secondary">{eyebrow}</span>
                    <h2 className="m-0 text-xl font-semibold">
                        {firstCodeSend.status === 'already_sending'
                            ? 'Send from this domain in your code'
                            : 'Send your first email from your code'}
                    </h2>
                    <p className="m-0 text-sm text-secondary">
                        <span>One API call from your server sends a sign-in code, a receipt or a password reset</span>
                        {fromAddress ? (
                            <span>
                                {' from '}
                                <span className="font-mono break-words">{fromAddress}</span>
                            </span>
                        ) : null}
                        <span>. PostHog links every email to the person who got it.</span>
                    </p>
                </div>
            </div>
            {firstCodeSend.status === 'arrived' ? null : (
                <div className="rounded-lg border bg-surface-primary p-4">
                    <SendFromCodeSnippet from={from} surface={surface} />
                </div>
            )}
            <FirstSendStatus surface={surface} />
        </section>
    )
}
