import { IconBolt } from '@posthog/icons'
import { LemonCard, Link } from '@posthog/lemon-ui'

import { urls } from 'scenes/urls'

export function StartWorkflowRow(): JSX.Element {
    return (
        <LemonCard hoverEffect={false} className="rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 min-w-0 text-sm">
                <IconBolt className="text-secondary text-lg shrink-0" />
                <span>
                    <b>Prefer an automation?</b> Start a workflow that sends from this domain, like a welcome series.
                </span>
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Link to={urls.workflows('library')} data-attr="email-domain-ready-pick-template">
                    Pick a template
                </Link>
                <Link to={urls.workflows()} data-attr="email-domain-ready-go-to-workflows">
                    Go to workflows
                </Link>
            </span>
        </LemonCard>
    )
}
