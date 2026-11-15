import '@testing-library/jest-dom'

import { cleanup, render, screen } from '@testing-library/react'
import { Provider } from 'kea'

import { FEATURE_FLAGS } from 'lib/constants'
import { featureFlagLogic } from 'lib/logic/featureFlagLogic'

import { useMocks } from '~/mocks/jest'
import { initKeaTests } from '~/test/init'

import { WizardDomainStep } from './WizardDomainStep'

const sender = (verified: boolean): Record<string, unknown> => ({
    id: 7,
    kind: 'email',
    display_name: 'hello@mail.acme.com',
    config: { domain: 'mail.acme.com', email: 'hello@mail.acme.com', name: 'Acme', verified },
    created_at: '2026-11-15T10:00:00Z',
})

describe('WizardDomainStep', () => {
    afterEach(cleanup)

    it.each([
        ['offers sending from code once the domain is verified', true, true],
        ['waits for a verified domain before offering sending from code', false, true],
        ['offers no sending from code without the Transactional emails tab', true, false],
    ])('%s', async (_case, verified, transactionalTabOn) => {
        useMocks({
            get: {
                '/api/environments/:team_id/integrations/': { results: [sender(verified)] },
                '/api/projects/:team_id/integrations/': { results: [sender(verified)] },
                '/api/projects/:team_id/transactional_code_emails/': [],
            },
        })
        initKeaTests()
        featureFlagLogic.actions.setFeatureFlags(
            [FEATURE_FLAGS.WORKFLOWS_EMAIL_FROM_CODE, FEATURE_FLAGS.WORKFLOWS_TRANSACTIONAL_EMAIL_API],
            {
                [FEATURE_FLAGS.WORKFLOWS_EMAIL_FROM_CODE]: true,
                [FEATURE_FLAGS.WORKFLOWS_TRANSACTIONAL_EMAIL_API]: transactionalTabOn,
            }
        )
        render(
            <Provider>
                <WizardDomainStep />
            </Provider>
        )

        expect(await screen.findAllByText(/mail\.acme\.com/)).not.toHaveLength(0)
        if (verified && transactionalTabOn) {
            expect(await screen.findByText('Send email from your code')).toBeInTheDocument()
            expect(document.querySelector('[data-attr="send-from-code-snippet"]')).toHaveTextContent(
                'from: "Acme <hello@mail.acme.com>"'
            )
        } else {
            expect(screen.queryByText('Send email from your code')).toBeNull()
        }
    })
})
